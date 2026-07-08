export interface Medico {
  id: string;
  userId: string;
  nome: string;
  crm: string;
  crmUf: string;
  especialidade: string | null;
  telefone: string | null;
  createdAt: string;
}
