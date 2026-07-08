import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, NotImplementedError } from "@/lib/api/errors";
import { pacienteRepository } from "@/lib/data";

/**
 * POST /api/pacientes/:id/resumo
 *
 * Gera um resumo inteligente do histórico do paciente (comorbidades,
 * alergias e linha do tempo), via um método futuro do aiService
 * (prompt: lib/ai/prompts/historico.md).
 *
 * STATUS: stub — responde 501 Not Implemented.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await obterMedicoAutenticado();

    const { id } = await params;
    const paciente = await pacienteRepository.buscarPorId(id);
    if (!paciente) {
      throw new NotFoundError("Paciente não encontrado.");
    }

    // TODO (módulo de IA): montar a linha do tempo via
    // pacienteRepository.buscarHistorico(id), chamar o método do
    // aiService responsável pelo resumo de histórico e retornar o texto
    // gerado (este endpoint não precisa persistir nada — é sob demanda).
    throw new NotImplementedError("Resumo do paciente ainda não implementado.");
  });
}
