import type { NextResponse } from "next/server";
import { ApiError, InternalServerError } from "./errors";
import { apiSuccess, apiErrorResponse, type ApiSuccessBody, type ApiErrorBody } from "./response";

/**
 * Envolve a lógica de uma rota de API. Toda rota do NuvoraCopilot segue
 * este padrão:
 *
 *   export async function POST(request: NextRequest, { params }) {
 *     return apiHandler(async () => {
 *       const { medico } = await obterMedicoAutenticado();
 *       const { id } = await params;
 *       // ...lógica da rota, lançando ApiError (ou subclasses) em caso
 *       // de problema...
 *       return dadoRetornado;
 *     });
 *   }
 *
 * Isso garante, sem repetição em cada rota:
 *   - Erros conhecidos (ApiError e subclasses) viram respostas JSON
 *     consistentes com o status HTTP correto.
 *   - Erros inesperados nunca vazam stack trace/detalhes internos ao
 *     cliente — viram um 500 genérico, com o erro real só no log do
 *     servidor.
 */
export async function apiHandler<T>(
  fn: () => Promise<T>,
  options?: { status?: number; metadata?: Record<string, unknown> }
): Promise<NextResponse<ApiSuccessBody<T> | ApiErrorBody>> {
  try {
    const data = await fn();
    return apiSuccess(data, options);
  } catch (error) {
    if (error instanceof ApiError) {
      return apiErrorResponse(error);
    }

    console.error("[API] Erro inesperado:", error);
    return apiErrorResponse(new InternalServerError());
  }
}
