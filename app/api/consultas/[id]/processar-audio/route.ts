import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, NotImplementedError } from "@/lib/api/errors";
import { consultaRepository } from "@/lib/data";

/**
 * POST /api/consultas/:id/processar-audio
 *
 * Dispara a transcrição do áudio da consulta via aiService.transcreverAudio().
 * Fluxo final (quando implementado):
 *   autenticar → validar posse da consulta → aiService.transcreverAudio()
 *   → persistir transcrição → responder.
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

    // TODO (módulo de IA): verificar que `consulta` pertence ao médico
    // autenticado (defesa em profundidade além do RLS) antes de chamar
    // aiService.transcreverAudio(consulta.audioUrl) — ver
    // docs/ARQUITETURA_API.md, seção "Verificação de posse do recurso".
    throw new NotImplementedError("Processamento de áudio ainda não implementado.");
  });
}
