import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/api/errors";
import type { ConsultaRepository } from "@/lib/data/types";
import type { Consulta, StatusConsulta } from "@/types/consulta";
import type { Database } from "@/types/database";

type ConsultaRow = Database["public"]["Tables"]["consultas"]["Row"];
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function obterUserIdAutenticado(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();
  return user.id;
}

/**
 * As tabelas de pacientes/unidades não são embutidas via join tipado
 * (o schema local em types/database.ts não declara Relationships) — em
 * vez disso, buscamos os nomes em lote, evitando N+1 e mantendo a
 * tipagem simples. Para o volume de um MVP isso é suficiente; se a base
 * crescer muito, o próximo passo natural é declarar as Relationships e
 * usar `.select("*, pacientes(nome), unidades(nome)")`.
 */
async function anexarNomes(supabase: SupabaseClient, rows: ConsultaRow[]): Promise<Consulta[]> {
  if (rows.length === 0) return [];

  const pacienteIds = [...new Set(rows.map((r) => r.paciente_id))];
  const unidadeIds = [...new Set(rows.map((r) => r.unidade_id))];

  const [{ data: pacientes }, { data: unidades }] = await Promise.all([
    supabase.from("pacientes").select("id, nome").in("id", pacienteIds),
    supabase.from("unidades").select("id, nome").in("id", unidadeIds),
  ]);

  const nomePaciente = new Map((pacientes ?? []).map((p) => [p.id, p.nome]));
  const nomeUnidade = new Map((unidades ?? []).map((u) => [u.id, u.nome]));

  return rows.map((row) => ({
    id: row.id,
    pacienteId: row.paciente_id,
    pacienteNome: nomePaciente.get(row.paciente_id) ?? "Paciente",
    medicoId: row.user_id,
    unidadeId: row.unidade_id,
    unidadeNome: nomeUnidade.get(row.unidade_id) ?? "Unidade",
    status: row.status as StatusConsulta,
    motivoConsulta: row.motivo_consulta ?? "",
    dataHora: row.data_hora,
    duracaoMinutos: row.duracao_minutos,
    audioUrl: row.audio_url,
    transcricao: row.transcricao,
    soap: row.soap,
    resumo: row.resumo,
    observacoes: row.observacoes,
  }));
}

export const consultaRepositorySupabase: ConsultaRepository = {
  async listar() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .select("*")
      .order("data_hora", { ascending: false });

    if (error) throw error;
    return anexarNomes(supabase, data ?? []);
  },

  async listarPorPaciente(pacienteId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("data_hora", { ascending: false });

    if (error) throw error;
    return anexarNomes(supabase, data ?? []);
  },

  async buscarPorId(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("consultas").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta ?? null;
  },

  async criar(dados) {
    const supabase = await createClient();
    const userId = await obterUserIdAutenticado(supabase);

    const { data, error } = await supabase
      .from("consultas")
      .insert({
        user_id: userId,
        paciente_id: dados.pacienteId,
        unidade_id: dados.unidadeId,
        motivo_consulta: dados.motivoConsulta,
        data_hora: dados.dataHora,
        status: "agendada",
      })
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async iniciarAgora(dados) {
    const supabase = await createClient();
    const userId = await obterUserIdAutenticado(supabase);

    const { data, error } = await supabase
      .from("consultas")
      .insert({
        user_id: userId,
        paciente_id: dados.pacienteId,
        unidade_id: dados.unidadeId,
        motivo_consulta: dados.motivoConsulta,
        data_hora: new Date().toISOString(),
        status: "em_andamento",
      })
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async iniciarAtendimento(id) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({ status: "em_andamento", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async atualizarObservacoes(id, observacoes) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({ observacoes, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async finalizar(id, dados) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({
        status: "concluida",
        duracao_minutos: dados.duracaoMinutos,
        audio_url: dados.audioUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async salvarTranscricao(id, transcricao) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({ transcricao, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async salvarSoapEResumo(id, soap, resumo) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({ soap, resumo, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async atualizar(id, dados) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .update({
        motivo_consulta: dados.motivoConsulta,
        data_hora: dados.dataHora,
        unidade_id: dados.unidadeId,
        resumo: dados.resumo,
        soap: dados.soap,
        observacoes: dados.observacoes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    const [consulta] = await anexarNomes(supabase, [data]);
    return consulta!;
  },

  async listarProximas(limite = 5) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultas")
      .select("*")
      .eq("status", "agendada")
      .order("data_hora", { ascending: true })
      .limit(limite);

    if (error) throw error;
    return anexarNomes(supabase, data ?? []);
  },
};
