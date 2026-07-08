export type StatusConsulta = "agendada" | "em_andamento" | "concluida" | "cancelada";

export interface Consulta {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  medicoId: string;
  unidadeId: string;
  unidadeNome: string;
  status: StatusConsulta;
  motivoConsulta: string;
  dataHora: string;
  duracaoMinutos: number | null;
  audioUrl: string | null;
  transcricao: string | null;
  soap: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  } | null;
  resumo: string | null;
  observacoes: string | null;
}
