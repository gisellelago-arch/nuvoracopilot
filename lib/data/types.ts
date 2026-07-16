import type { Paciente, EntradaHistorico } from "@/types/paciente";
import type { Consulta } from "@/types/consulta";
import type { Exame } from "@/types/exame";
import type { Medico } from "@/types/medico";
import type { Unidade } from "@/types/unidade";

/**
 * Contratos de acesso a dados. A UI depende apenas destas interfaces,
 * nunca da implementação concreta (mock ou Supabase). Isso permite trocar
 * a fonte de dados sem alterar nenhuma tela — ver lib/data/index.ts.
 */

export interface PacienteRepository {
  listar(filtro?: string): Promise<Paciente[]>;
  buscarPorId(id: string): Promise<Paciente | null>;
  criar(dados: Omit<Paciente, "id" | "criadoEm" | "ultimaConsultaEm">): Promise<Paciente>;
  atualizar(id: string, dados: Omit<Paciente, "id" | "criadoEm" | "ultimaConsultaEm">): Promise<Paciente>;
  excluir(id: string): Promise<void>;
  buscarHistorico(pacienteId: string): Promise<EntradaHistorico[]>;
}

export interface ConsultaRepository {
  listar(): Promise<Consulta[]>;
  listarPorPaciente(pacienteId: string): Promise<Consulta[]>;
  buscarPorId(id: string): Promise<Consulta | null>;
  criar(dados: Pick<Consulta, "pacienteId" | "pacienteNome" | "unidadeId" | "unidadeNome" | "motivoConsulta" | "dataHora">): Promise<Consulta>;
  iniciarAgora(dados: Pick<Consulta, "pacienteId" | "pacienteNome" | "unidadeId" | "unidadeNome" | "motivoConsulta">): Promise<Consulta>;
  iniciarAtendimento(id: string): Promise<Consulta>;
  atualizarObservacoes(id: string, observacoes: string): Promise<Consulta>;
  finalizar(id: string, dados: { duracaoMinutos: number; audioUrl: string | null }): Promise<Consulta>;
  salvarTranscricao(id: string, transcricao: string): Promise<Consulta>;
  salvarSoapEResumo(id: string, soap: Consulta["soap"], resumo: string): Promise<Consulta>;
  listarProximas(limite?: number): Promise<Consulta[]>;
  atualizar(
    id: string,
    dados: Pick<Consulta, "motivoConsulta" | "dataHora" | "unidadeId" | "resumo" | "soap" | "observacoes">
  ): Promise<Consulta>;
}

export interface ExameRepository {
  listar(): Promise<Exame[]>;
  listarPorPaciente(pacienteId: string): Promise<Exame[]>;
  listarPorConsulta(consultaId: string): Promise<Exame[]>;
  buscarPorId(id: string): Promise<Exame | null>;
}

/**
 * Diferente dos demais, este repositório já é conectado ao Supabase real
 * desde o início — o perfil do médico nasce junto com a autenticação.
 */
export interface MedicoRepository {
  buscarPorUserId(userId: string): Promise<Medico | null>;
  atualizar(userId: string, dados: Partial<Omit<Medico, "id" | "userId" | "createdAt">>): Promise<Medico>;
}

export interface UnidadeRepository {
  listar(): Promise<Unidade[]>;
  buscarPorId(id: string): Promise<Unidade | null>;
  criar(dados: Pick<Unidade, "nome" | "tipo">): Promise<Unidade>;
  atualizar(id: string, dados: Pick<Unidade, "nome" | "tipo">): Promise<Unidade>;
  excluir(id: string): Promise<void>;
}
