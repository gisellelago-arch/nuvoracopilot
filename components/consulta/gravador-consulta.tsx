"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Square, Mic, MicOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { salvarObservacoes, finalizarConsultaAction } from "@/lib/actions/consulta.actions";

interface GravadorConsultaProps {
  consultaId: string;
  observacoesIniciais: string;
}

type EtapaProcessamento =
  | "ocioso"
  | "enviando_audio"
  | "transcrevendo"
  | "gerando_soap"
  | "concluido"
  | "erro";

const MENSAGEM_ETAPA: Record<EtapaProcessamento, string> = {
  ocioso: "",
  enviando_audio: "Enviando áudio...",
  transcrevendo: "Transcrevendo a consulta...",
  gerando_soap: "Gerando evolução SOAP e resumo...",
  concluido: "Concluído!",
  erro: "",
};

function formatarTempo(totalSegundos: number) {
  const minutos = Math.floor(totalSegundos / 60)
    .toString()
    .padStart(2, "0");
  const segundos = (totalSegundos % 60).toString().padStart(2, "0");
  return `${minutos}:${segundos}`;
}

function escolherMimeType() {
  const candidatos = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  for (const tipo of candidatos) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(tipo)) {
      return tipo;
    }
  }
  return undefined; // deixa o navegador escolher
}

export function GravadorConsulta({ consultaId, observacoesIniciais }: GravadorConsultaProps) {
  const router = useRouter();
  const [segundos, setSegundos] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [temGravacao, setTemGravacao] = useState(false);
  const [erroMicrofone, setErroMicrofone] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<EtapaProcessamento>("ocioso");
  const [erroProcessamento, setErroProcessamento] = useState<string | null>(null);
  const [salvandoObservacoes, setSalvandoObservacoes] = useState(false);

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (gravando) {
      intervaloRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    } else if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [gravando]);

  // Libera o microfone se o componente for desmontado no meio de uma gravação.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function iniciarOuRetomarGravacao() {
    setErroMicrofone(null);

    // Retomando uma gravação pausada — mesmo MediaRecorder, só continua.
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setGravando(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: escolherMimeType(),
      });
      mediaRecorder.ondataavailable = (evento) => {
        if (evento.data.size > 0) chunksRef.current.push(evento.data);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setGravando(true);
      setTemGravacao(true);
    } catch (erro) {
      console.error("[GravadorConsulta] Erro ao acessar o microfone:", erro);
      setErroMicrofone(
        "Não foi possível acessar o microfone. Verifique se o navegador tem permissão para usá-lo."
      );
    }
  }

  function pausarGravacao() {
    mediaRecorderRef.current?.pause();
    setGravando(false);
  }

  function pararGravacaoEObterAudio(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(chunksRef.current.length > 0 ? new Blob(chunksRef.current) : null);
        return;
      }

      mediaRecorder.onstop = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        const tipo = mediaRecorder.mimeType || "audio/webm";
        resolve(chunksRef.current.length > 0 ? new Blob(chunksRef.current, { type: tipo }) : null);
      };
      mediaRecorder.stop();
    });
  }

  async function aoClicarSalvarObservacoes() {
    setSalvandoObservacoes(true);
    try {
      const formData = new FormData();
      formData.set("observacoes", textareaRef.current?.value ?? "");
      await salvarObservacoes(consultaId, formData);
    } finally {
      setSalvandoObservacoes(false);
    }
  }

  async function aoClicarFinalizar() {
    setErroProcessamento(null);
    setEtapa("enviando_audio");
    setGravando(false);

    const audioBlob = await pararGravacaoEObterAudio();

    const formData = new FormData();
    formData.set("duracaoSegundos", String(segundos));
    formData.set("observacoes", textareaRef.current?.value ?? "");
    if (audioBlob) {
      formData.set("audio", audioBlob, "consulta.webm");
    }

    const resultadoFinalizar = await finalizarConsultaAction(consultaId, formData);
    if (!resultadoFinalizar.sucesso) {
      setEtapa("erro");
      setErroProcessamento(resultadoFinalizar.erro ?? "Não foi possível finalizar a consulta.");
      return;
    }

    // Sem áudio gravado, não há o que transcrever — encerra aqui.
    if (!audioBlob) {
      setEtapa("concluido");
      router.refresh();
      return;
    }

    try {
      setEtapa("transcrevendo");
      const respostaTranscricao = await fetch(`/api/consultas/${consultaId}/processar-audio`, {
        method: "POST",
      });
      const corpoTranscricao = await respostaTranscricao.json();
      if (!respostaTranscricao.ok || !corpoTranscricao.success) {
        throw new Error(corpoTranscricao.error?.message ?? "Falha ao transcrever o áudio.");
      }

      setEtapa("gerando_soap");
      const respostaSoap = await fetch(`/api/consultas/${consultaId}/gerar-soap`, {
        method: "POST",
      });
      const corpoSoap = await respostaSoap.json();
      if (!respostaSoap.ok || !corpoSoap.success) {
        throw new Error(corpoSoap.error?.message ?? "Falha ao gerar a evolução SOAP.");
      }

      setEtapa("concluido");
      router.refresh();
    } catch (erro) {
      console.error("[GravadorConsulta] Erro no pipeline de IA:", erro);
      setEtapa("erro");
      setErroProcessamento(
        erro instanceof Error
          ? erro.message
          : "Não foi possível processar a consulta com IA. A consulta foi salva normalmente."
      );
    }
  }

  const processando = etapa !== "ocioso" && etapa !== "erro" && etapa !== "concluido";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 py-8">
        <p className="tabular-data text-3xl font-semibold">{formatarTempo(segundos)}</p>

        {!gravando ? (
          <Button type="button" onClick={iniciarOuRetomarGravacao} disabled={processando}>
            <Mic className="h-4 w-4" /> {temGravacao ? "Retomar gravação" : "Iniciar gravação"}
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={pausarGravacao}>
            <Pause className="h-4 w-4" /> Pausar
          </Button>
        )}

        {gravando && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" /> Gravando
          </p>
        )}

        {erroMicrofone && (
          <p className="flex max-w-xs items-center gap-1.5 text-center text-xs text-destructive">
            <MicOff className="h-3.5 w-3.5 shrink-0" /> {erroMicrofone}
          </p>
        )}

        <p className="max-w-xs text-center text-xs text-muted-foreground">
          O áudio é gravado no seu navegador e enviado com segurança só ao finalizar a consulta.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações da consulta</Label>
          <Textarea
            id="observacoes"
            ref={textareaRef}
            rows={6}
            placeholder="Anote aqui o que for relevante durante o atendimento..."
            defaultValue={observacoesIniciais}
            disabled={processando}
          />
        </div>

        {etapa !== "ocioso" && (
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
              etapa === "erro"
                ? "bg-destructive/10 text-destructive"
                : etapa === "concluido"
                  ? "bg-success/10 text-success"
                  : "bg-accent text-accent-foreground"
            }`}
          >
            {processando && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
            {etapa === "concluido" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {etapa === "erro" && <AlertTriangle className="h-4 w-4 shrink-0" />}
            <span>
              {etapa === "erro"
                ? erroProcessamento
                : etapa === "concluido"
                  ? "Consulta processada com sucesso."
                  : MENSAGEM_ETAPA[etapa]}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={aoClicarSalvarObservacoes}
            disabled={salvandoObservacoes || processando}
          >
            {salvandoObservacoes ? "Salvando..." : "Salvar observações"}
          </Button>
          <Button type="button" onClick={aoClicarFinalizar} disabled={processando}>
            <Square className="h-4 w-4" /> Finalizar consulta
          </Button>
        </div>
      </div>
    </div>
  );
}
