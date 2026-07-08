/**
 * Erros padronizados da API do NuvoraCopilot.
 *
 * Toda rota lança um destes erros (ou deixa um erro inesperado estourar,
 * que o `apiHandler` transforma em 500) em vez de formatar uma resposta
 * de erro manualmente. Isso garante que toda API do sistema responde
 * erros no mesmo formato, sempre.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Não autenticado.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Você não tem acesso a este recurso.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Dados inválidos.", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}

export class NotImplementedError extends ApiError {
  constructor(message = "Esta operação ainda não foi implementada.") {
    super(message, 501, "NOT_IMPLEMENTED");
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "Erro interno do servidor.") {
    super(message, 500, "INTERNAL_ERROR");
  }
}
