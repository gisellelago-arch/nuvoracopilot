import { z } from "zod";
import { validarCPF } from "@/lib/utils/cpf";

// Transforma "Dipirona, Látex" em ["Dipirona", "Látex"], removendo vazios.
const listaSeparadaPorVirgula = z
  .string()
  .optional()
  .transform((valor) =>
    (valor ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );

export const pacienteSchema = z.object({
  nome: z.string().min(3, "Informe o nome completo do paciente."),
  cpf: z
    .string()
    .min(1, "Informe o CPF.")
    .refine(validarCPF, "CPF inválido.")
    .transform((valor) => valor.replace(/\D/g, "")),
  dataNascimento: z.string().min(1, "Informe a data de nascimento."),
  sexo: z.enum(["masculino", "feminino"], {
    errorMap: () => ({ message: "Selecione o sexo do paciente." }),
  }),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z
    .string()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "E-mail inválido."),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z
    .string()
    .optional()
    .transform((v) => (v ? v.toUpperCase() : undefined)),
  convenio: z.string().optional(),
  alergias: listaSeparadaPorVirgula,
  comorbidades: listaSeparadaPorVirgula,
  observacoes: z.string().optional(),
});

export type PacienteInput = z.infer<typeof pacienteSchema>;
