import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, NotImplementedError } from "@/lib/api/errors";
import { consultaRepository } from "@/lib/data";

/**
 * POST /api/consultas/:id/gerar-soap
 *
 * Gera a evolução em formato SOAP a partir da transcrição já salva na
 * consulta, via aiService.gerarSOAP() (prompt: lib/ai/prompts/soap.md).
 *
 * STATUS: stub — responde 501 Not Implemented.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await obterMedicoAutenticado();

    const { id } = await params;
    const consulta = await consultaRepository.buscarPorId(id);
    if (!consulta) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    // TODO (módulo de IA): exigir que `consulta.transcricao` já exista
    // (senão retornar ValidationError orientando a processar o áudio
    // primeiro), depois chamar aiService.gerarSOAP(consulta.transcricao)
    // e persistir o resultado em consulta.soap.
    throw new NotImplementedError("Geração de SOAP ainda não implementada.");
  });
}
