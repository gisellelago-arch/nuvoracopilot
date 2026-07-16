import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { consultaRepository } from "@/lib/data";
import { aiService } from "@/lib/ai";

/**
 * POST /api/consultas/:id/gerar-soap
 *
 * Gera a evolução SOAP e o resumo da consulta a partir da transcrição
 * já salva, via aiService.gerarSOAP() + aiService.gerarResumo()
 * (prompts: lib/ai/prompts/soap.md e resumo-consulta.md).
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const { medico } = await obterMedicoAutenticado();

    const { id } = await params;
    const consulta = await consultaRepository.buscarPorId(id);
    if (!consulta) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    if (consulta.medicoId !== medico.userId) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    if (!consulta.transcricao) {
      throw new ValidationError(
        "Esta consulta ainda não tem transcrição. Processe o áudio primeiro."
      );
    }

    const [soap, resumo] = await Promise.all([
      aiService.gerarSOAP(consulta.transcricao),
      aiService.gerarResumo(consulta.transcricao),
    ]);

    const consultaAtualizada = await consultaRepository.salvarSoapEResumo(id, soap, resumo);

    return { soap: consultaAtualizada.soap, resumo: consultaAtualizada.resumo };
  });
}
