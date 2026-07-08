import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotImplementedError } from "@/lib/api/errors";

/**
 * POST /api/ia/chat
 *
 * Chat clínico livre com o NuvoraCopilot (ex: "resuma os últimos exames
 * deste paciente", "que perguntas devo fazer nesse retorno?").
 *
 * Diferente das demais rotas, esta terá resposta em streaming (Server-Sent
 * Events / ReadableStream) quando implementada — uma resposta única em
 * JSON não é adequada para um chat. O formato de sucesso padrão
 * (`{ success, data }`) não se aplica aqui; a rota deve retornar um
 * `Response` com `Content-Type: text/event-stream` diretamente, sem
 * passar por `apiHandler`/`apiSuccess`.
 *
 * STATUS: stub — responde 501 Not Implemented em JSON simples (ainda
 * sem streaming, já que não há nada para transmitir).
 */
export async function POST(_request: NextRequest) {
  return apiHandler(async () => {
    await obterMedicoAutenticado();

    // TODO (módulo de IA): validar { mensagem, pacienteId?, consultaId? }
    // no corpo da requisição, montar o contexto clínico relevante, e
    // abrir um stream de resposta do provedor via aiService.
    throw new NotImplementedError("Chat clínico ainda não implementado.");
  });
}
