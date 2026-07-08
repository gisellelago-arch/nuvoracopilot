import { NextResponse } from "next/server";
import type { ApiError } from "./errors";

/**
 * Formato único de resposta de toda API do NuvoraCopilot.
 *
 * Sucesso:
 *   { "success": true, "data": ..., "metadata"?: { ... } }
 *
 * Erro:
 *   { "success": false, "error": { "code": "...", "message": "...", "details"?: ... } }
 *
 * `metadata` é opcional e usado para informações auxiliares que não são
 * o dado principal da resposta (ex: paginação, tempo de processamento,
 * modelo de IA utilizado).
 */

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(
  data: T,
  options?: { status?: number; metadata?: Record<string, unknown> }
): NextResponse<ApiSuccessBody<T>> {
  const body: ApiSuccessBody<T> = { success: true, data };
  if (options?.metadata) body.metadata = options.metadata;
  return NextResponse.json(body, { status: options?.status ?? 200 });
}

export function apiErrorResponse(error: ApiError): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details !== undefined && { details: error.details }),
    },
  };
  return NextResponse.json(body, { status: error.status });
}
