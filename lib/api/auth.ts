import { createClient } from "@/lib/supabase/server";
import { medicoRepository } from "@/lib/data";
import { UnauthorizedError } from "./errors";
import type { Medico } from "@/types/medico";
import type { User } from "@supabase/supabase-js";

/**
 * Autentica a requisição e retorna o usuário do Supabase Auth junto com
 * o perfil de médico correspondente. Lança `UnauthorizedError` (401) se
 * não houver sessão válida ou se o perfil de médico não existir.
 *
 * Toda rota de API que exige autenticação chama isto como primeira linha
 * dentro do `apiHandler` — ver lib/api/handler.ts.
 *
 * Hoje a sessão é lida via cookie (@supabase/ssr). Quando um cliente
 * mobile nativo precisar consumir estas mesmas rotas, este é o único
 * lugar que precisa aprender a também aceitar um Bearer token — nenhuma
 * rota individual muda.
 */
export async function obterMedicoAutenticado(): Promise<{ user: User; medico: Medico }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  const medico = await medicoRepository.buscarPorUserId(user.id);

  if (!medico) {
    throw new UnauthorizedError("Perfil de médico não encontrado para este usuário.");
  }

  return { user, medico };
}
