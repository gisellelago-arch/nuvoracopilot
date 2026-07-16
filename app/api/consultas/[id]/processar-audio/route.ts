import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError, ValidationError } from "@/lib/api/errors";
import { consultaRepository } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { aiService } from "@/lib/ai";

/**
 * POST /api/consultas/:id/processar-audio
 *
 * Gera uma signed URL de curta duração para o áudio (o bucket é
 * privado), transcreve via aiService.transcreverAudio() e persiste o
 * resultado na consulta.
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const { medico } = await obterMedicoAutenticado();

    const { id } = await params;
    const consulta = await consultaRepository.buscarPorId(id);
    if (!consulta) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    // Defesa em profundidade além do RLS: garante que a consulta
    // pertence ao médico autenticado antes de gastar uma chamada paga
    // de IA sobre o recurso errado.
    if (consulta.medicoId !== medico.userId) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    if (!consulta.audioUrl) {
      throw new ValidationError("Esta consulta não tem áudio gravado para transcrever.");
    }

    const supabase = await createClient();
    const { data: signedUrlData, error: erroSignedUrl } = await supabase.storage
      .from("audios-consultas")
      .createSignedUrl(consulta.audioUrl, 300);

    if (erroSignedUrl || !signedUrlData) {
      throw new ValidationError("Não foi possível acessar o arquivo de áudio.");
    }

    const { texto } = await aiService.transcreverAudio(signedUrlData.signedUrl);
    const consultaAtualizada = await consultaRepository.salvarTranscricao(id, texto);

    return { transcricao: consultaAtualizada.transcricao };
  });
}
