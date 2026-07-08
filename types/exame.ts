export type OrigemExame = "foto" | "pdf" | "audio";
export type StatusExame = "processando" | "concluido" | "erro";

export interface Exame {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  tipoExame: string;
  origem: OrigemExame;
  status: StatusExame;
  arquivoUrl: string;
  dataExame: string;
  enviadoEm: string;
  observacoes: string | null;
}
