"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MENSAGENS = {
  ocioso: "",
  transcrevendo: "Transcrevendo a consulta...",
  gerando_soap: "Gerando evolução SOAP e resumo...",
} as const;

type Etapa = keyof typeof MENSAGENS;

export function ReprocessarConsultaButton({ consultaId }: { consultaId: string }) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<Etapa>("ocioso");
  const [erro, setErro] = useState<string | null>(null);

  async function processar() {
    setErro(null);
    try {
      setEtapa("transcrevendo");
      const respTranscricao = await fetch(`/api/consultas/${consultaId}/processar-audio`, {
        method: "POST",
      });
      const corpoTranscricao = await respTranscricao.json();
      if (!respTranscricao.ok || !corpoTranscricao.success) {
        throw new Error(corpoTranscricao.error?.message ?? "Falha ao transcrever o áudio.");
      }

      setEtapa("gerando_soap");
      const respSoap = await fetch(`/api/consultas/${consultaId}/gerar-soap`, { method: "POST" });
      const corpoSoap = await respSoap.json();
      if (!respSoap.ok || !corpoSoap.success) {
        throw new Error(corpoSoap.error?.message ?? "Falha ao gerar a evolução SOAP.");
      }

      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível processar a consulta.");
    } finally {
      setEtapa("ocioso");
    }
  }

  const processando = etapa !== "ocioso";

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Button type="button" onClick={processar} disabled={processando}>
        {processando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {processando ? MENSAGENS[etapa] : "Processar com IA"}
      </Button>
      {erro && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {erro}
        </p>
      )}
    </div>
  );
}
