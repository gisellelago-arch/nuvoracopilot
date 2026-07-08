import { z } from "zod";

export const unidadeSchema = z.object({
  nome: z.string().min(2, "Informe o nome da unidade."),
  tipo: z.enum(["ubs", "hospital", "clinica", "consultorio_particular", "outro"], {
    errorMap: () => ({ message: "Selecione um tipo de unidade." }),
  }),
});

export type UnidadeInput = z.infer<typeof unidadeSchema>;
