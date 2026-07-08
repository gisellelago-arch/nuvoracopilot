import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const esqueciSenhaSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
});

export type EsqueciSenhaInput = z.infer<typeof esqueciSenhaSchema>;

export const redefinirSenhaSchema = z
  .object({
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmarSenha: z.string().min(1, "Confirme sua nova senha."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

export type RedefinirSenhaInput = z.infer<typeof redefinirSenhaSchema>;

export const registerSchema = z.object({
  nome: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  crm: z.string().min(3, "Informe um número de CRM válido."),
  crmUf: z.string().length(2, "Use a sigla do estado (ex: SP)."),
  especialidade: z.string().optional(),
  telefone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
