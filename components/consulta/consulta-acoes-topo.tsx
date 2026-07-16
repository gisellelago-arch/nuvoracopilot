"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardCopy, ClipboardList, Pencil, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatarDataHora } from "@/lib/utils/date";
import type { Consulta } from "@/types/consulta";

interface ConsultaAcoesTopoProps {
  consulta: Consulta;
}

function montarTextoSus(consulta: Consulta): string {
  const linhas: string[] = [];

  linhas.push(`Data e local: ${formatarDataHora(consulta.dataHora)} — ${consulta.unidadeNome}`);
  linhas.push("");

  if (consulta.resumo) {
    linhas.push("Resumo clínico:");
    linhas.push(consulta.resumo);
    linhas.push("");
  }

  if (consulta.soap) {
    linhas.push("Evolução SOAP:");
    linhas.push(`Subjetivo: ${consulta.soap.subjetivo || "Não mencionado na consulta."}`);
    linhas.push(`Objetivo: ${consulta.soap.objetivo || "Não mencionado na consulta."}`);
    linhas.push(`Avaliação: ${consulta.soap.avaliacao || "Não mencionado na consulta."}`);
    linhas.push(`Plano: ${consulta.soap.plano || "Não mencionado na consulta."}`);
    linhas.push("");
  }

  if (consulta.observacoes) {
    linhas.push("Observações:");
    linhas.push(consulta.observacoes);
  }

  return linhas.join("\n").trim();
}

function montarTextoSoap(consulta: Consulta): string {
  if (!consulta.soap) return "";
  return [
    "Evolução SOAP:",
    `Subjetivo: ${consulta.soap.subjetivo || "Não mencionado na consulta."}`,
    `Objetivo: ${consulta.soap.objetivo || "Não mencionado na consulta."}`,
    `Avaliação: ${consulta.soap.avaliacao || "Não mencionado na consulta."}`,
    `Plano: ${consulta.soap.plano || "Não mencionado na consulta."}`,
  ].join("\n");
}

export function ConsultaAcoesTopo({ consulta }: ConsultaAcoesTopoProps) {
  const [mensagem, setMensagem] = useState<string | null>(null);

  const podeCopiarSus = Boolean(consulta.resumo || consulta.soap || consulta.observacoes);
  const podeCopiarSoap = Boolean(consulta.soap);

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setMensagem("Conteúdo copiado para o prontuário.");
      setTimeout(() => setMensagem(null), 3000);
    } catch {
      setMensagem("Não foi possível copiar. Selecione e copie manualmente.");
      setTimeout(() => setMensagem(null), 4000);
    }
  }

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!podeCopiarSus}
          onClick={() => copiar(montarTextoSus(consulta))}
        >
          <ClipboardCopy className="h-4 w-4" />
          Copiar para o SUS
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!podeCopiarSoap}
          onClick={() => copiar(montarTextoSoap(consulta))}
        >
          <ClipboardList className="h-4 w-4" />
          Copiar somente SOAP
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/consultas/${consulta.id}/editar`}>
            <Pencil className="h-4 w-4" />
            Editar consulta
          </Link>
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/pacientes/${consulta.pacienteId}/consultas`}>
            <ArrowLeft className="h-4 w-4" />
            Voltar para consultas
          </Link>
        </Button>
      </div>
      {mensagem && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-success">
          <Check className="h-3.5 w-3.5" />
          {mensagem}
        </p>
      )}
    </div>
  );
}
