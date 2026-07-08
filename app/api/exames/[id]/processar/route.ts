import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, NotImplementedError } from "@/lib/api/errors";
import { exameRepository } from "@/lib/data";

/**
 * POST /api/exames/:id/processar
 *
 * Extrai dados estruturados de um exame (foto/PDF/áudio) via
 * aiService.extrairDadosExame() (prompt: lib/ai/prompts/exames.md).
 *
 * STATUS: stub — responde 501 Not Implemented.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    await obterMedicoAutenticado();

    const { id } = await params;
    const exame = await exameRepository.buscarPorId(id);
    if (!exame) {
      throw new NotFoundError("Exame não encontrado.");
    }

    // TODO (módulo de IA): chamar
    // aiService.extrairDadosExame(exame.arquivoUrl, exame.origem) e
    // persistir tipoExame/dataExame/valoresEstruturados no repositório,
    // atualizando exame.status para "concluido" (ou "erro").
    throw new NotImplementedError("Processamento de exame ainda não implementado.");
  });
}
