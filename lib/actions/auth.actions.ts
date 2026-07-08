"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  esqueciSenhaSchema,
  redefinirSenhaSchema,
} from "@/lib/validators/auth.schema";

export interface AuthActionState {
  erro?: string;
  sucesso?: boolean;
  camposComErro?: Record<string, string>;
}

export async function entrar(
  _estadoAnterior: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const resultado = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });

  if (!resultado.success) {
    return { erro: "Verifique os dados informados." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: resultado.data.email,
    password: resultado.data.senha,
  });

  if (error) {
    return { erro: "E-mail ou senha incorretos." };
  }

  redirect("/dashboard");
}

export async function cadastrar(
  _estadoAnterior: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const resultado = registerSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    crm: formData.get("crm"),
    crmUf: formData.get("crmUf"),
    especialidade: formData.get("especialidade") || undefined,
    telefone: formData.get("telefone") || undefined,
  });

  if (!resultado.success) {
    const primeiroErro = resultado.error.issues[0]?.message ?? "Verifique os dados informados.";
    return { erro: primeiroErro };
  }

  const supabase = await createClient();
  const { data } = resultado;

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.senha,
    options: {
      // Estes dados chegam em raw_user_meta_data e alimentam o trigger
      // handle_new_medico(), que cria a linha em `medicos` automaticamente.
      data: {
        nome: data.nome,
        crm: data.crm,
        crm_uf: data.crmUf.toUpperCase(),
        especialidade: data.especialidade ?? null,
        telefone: data.telefone ?? null,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { erro: "Este e-mail já está cadastrado." };
    }
    return { erro: "Não foi possível concluir o cadastro. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function solicitarRecuperacaoSenha(
  _estadoAnterior: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const resultado = esqueciSenhaSchema.safeParse({
    email: formData.get("email"),
  });

  if (!resultado.success) {
    return { erro: "Informe um e-mail válido." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(resultado.data.email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  // Por segurança, nunca revelamos se o e-mail existe ou não na base —
  // a resposta é sempre "sucesso" do ponto de vista do usuário.
  if (error) {
    return { erro: "Não foi possível processar sua solicitação. Tente novamente em instantes." };
  }

  return { sucesso: true };
}

export async function redefinirSenha(
  _estadoAnterior: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const resultado = redefinirSenhaSchema.safeParse({
    senha: formData.get("senha"),
    confirmarSenha: formData.get("confirmarSenha"),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  const supabase = await createClient();

  // Só chega aqui com sessão válida se tiver vindo do link de recuperação
  // (ver ROTAS_PUBLICAS em lib/supabase/middleware.ts).
  const { error } = await supabase.auth.updateUser({ password: resultado.data.senha });

  if (error) {
    return { erro: "Não foi possível redefinir sua senha. Solicite um novo link." };
  }

  redirect("/dashboard");
}
