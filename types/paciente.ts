export type SexoPaciente = "masculino" | "feminino";

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: SexoPaciente;
  telefone: string;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  convenio: string | null;
  alergias: string[];
  comorbidades: string[];
  observacoes: string | null;
  criadoEm: string;
  ultimaConsultaEm: string | null;
}

export interface EntradaHistorico {
  id: string;
  pacienteId: string;
  tipo: "consulta" | "exame" | "anotacao";
  titulo: string;
  descricao: string;
  data: string;
}
