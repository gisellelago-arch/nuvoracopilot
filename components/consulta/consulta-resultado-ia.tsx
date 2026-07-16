import { FileText, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReprocessarConsultaButton } from "@/components/consulta/reprocessar-consulta-button";
import { ConsultaTranscricao } from "@/components/consulta/consulta-transcricao";
import type { Consulta } from "@/types/consulta";

function SecaoSoap({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{titulo}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm">{texto || "Não mencionado na consulta."}</p>
    </div>
  );
}

export function ConsultaResultadoIA({ consulta }: { consulta: Consulta }) {
  // Sem áudio nenhum gravado — não há o que processar.
  if (!consulta.audioUrl) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
          <AlertCircle className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            Nenhum áudio foi gravado nesta consulta — não há transcrição ou SOAP para gerar.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Áudio existe, mas o processamento ainda não rodou (ou falhou antes).
  if (!consulta.transcricao) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-8">
          <p className="text-center text-sm text-muted-foreground">
            O áudio foi salvo, mas ainda não foi processado pela IA.
          </p>
          <ReprocessarConsultaButton consultaId={consulta.id} />
        </CardContent>
      </Card>
    );
  }

  // Transcrição pronta, mas o SOAP ainda não foi gerado (ou falhou nessa etapa).
  if (!consulta.soap) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8">
            <p className="text-center text-sm text-muted-foreground">SOAP ainda não gerado.</p>
            <ReprocessarConsultaButton consultaId={consulta.id} />
          </CardContent>
        </Card>
        <ConsultaTranscricao transcricao={consulta.transcricao} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {consulta.resumo && (
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm">{consulta.resumo}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <FileText className="h-4 w-4 text-primary" />
          <CardTitle>Evolução SOAP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <SecaoSoap titulo="Subjetivo" texto={consulta.soap.subjetivo} />
          <SecaoSoap titulo="Objetivo" texto={consulta.soap.objetivo} />
          <SecaoSoap titulo="Avaliação" texto={consulta.soap.avaliacao} />
          <SecaoSoap titulo="Plano" texto={consulta.soap.plano} />
        </CardContent>
      </Card>

      {consulta.soap.pontosParaConfirmar && consulta.soap.pontosParaConfirmar.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <HelpCircle className="h-4 w-4 text-primary" />
            <CardTitle>Pontos para confirmar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {consulta.soap.pontosParaConfirmar.map((ponto, indice) => (
                <li key={indice}>{ponto}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <ConsultaTranscricao transcricao={consulta.transcricao} />

      <p className="text-center text-xs text-muted-foreground">
        Conteúdo gerado por IA a partir do áudio da consulta — revise antes de copiar para o
        prontuário oficial. A decisão clínica é sempre sua.
      </p>
    </div>
  );
}
