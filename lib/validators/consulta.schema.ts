import { z } from "zod";

// Validação para a edição pontual de uma consulta já registrada.
// Não cobre gravação, transcrição ou geração de SOAP por IA — apenas a
// correção manual dos campos já persistidos (ETAPA 2).
export const consultaEditarSchema = z.object({
  motivoConsulta: z.string().min(1, "Informe o tipo da consulta."),
  data: z.string().min(1, "Informe a data da consulta."),
  hora: z.string().min(1, "Informe o horário da consulta."),
  unidadeId: z.string().min(1, "Selecione a unidade de atendimento."),
  resumo: z.string().optional(),
  subjetivo: z.string().optional(),
  objetivo: z.string().optional(),
  avaliacao: z.string().optional(),
  plano: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ConsultaEditarInput = z.infer<typeof consultaEditarSchema>;
