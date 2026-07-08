import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/api/errors";
import type { PacienteRepository } from "@/lib/data/types";
import type { Paciente, EntradaHistorico, SexoPaciente } from "@/types/paciente";
import type { Database } from "@/types/database";

type PacienteRow = Database["public"]["Tables"]["pacientes"]["Row"];

function paraDominio(row: PacienteRow, ultimaConsultaEm: string | null = null): Paciente {
  return {
    id: row.id,
    nome: row.nome,
    cpf: row.cpf,
    dataNascimento: row.data_nascimento,
    sexo: row.sexo as SexoPaciente,
    telefone: row.telefone ?? "",
    email: row.email,
    endereco: row.endereco,
    cidade: row.cidade,
    estado: row.estado,
    convenio: row.convenio,
    alergias: row.alergias ?? [],
    comorbidades: row.comorbidades ?? [],
    observacoes: row.observacoes,
    criadoEm: row.created_at,
    ultimaConsultaEm,
  };
}

async function obterUserIdAutenticado(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();
  return user.id;
}

export const pacienteRepositorySupabase: PacienteRepository = {
  async listar(filtro) {
    const supabase = await createClient();
    let query = supabase.from("pacientes").select("*").order("nome", { ascending: true });

    if (filtro) {
      const termo = filtro.replace(/\D/g, "").length >= 3 ? filtro.replace(/\D/g, "") : filtro;
      query = query.or(`nome.ilike.%${filtro}%,cpf.ilike.%${termo}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row) => paraDominio(row));
  },

  async buscarPorId(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const { data: ultimaConsulta } = await supabase
      .from("consultas")
      .select("data_hora")
      .eq("paciente_id", id)
      .order("data_hora", { ascending: false })
      .limit(1)
      .maybeSingle();

    return paraDominio(data, ultimaConsulta?.data_hora ?? null);
  },

  async criar(dados) {
    const supabase = await createClient();
    const userId = await obterUserIdAutenticado(supabase);

    const { data, error } = await supabase
      .from("pacientes")
      .insert({
        user_id: userId,
        nome: dados.nome,
        cpf: dados.cpf,
        data_nascimento: dados.dataNascimento,
        sexo: dados.sexo,
        telefone: dados.telefone,
        email: dados.email,
        endereco: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
        convenio: dados.convenio,
        alergias: dados.alergias,
        comorbidades: dados.comorbidades,
        observacoes: dados.observacoes,
      })
      .select()
      .single();

    if (error) throw error;
    return paraDominio(data);
  },

  async atualizar(id, dados) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pacientes")
      .update({
        nome: dados.nome,
        cpf: dados.cpf,
        data_nascimento: dados.dataNascimento,
        sexo: dados.sexo,
        telefone: dados.telefone,
        email: dados.email,
        endereco: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
        convenio: dados.convenio,
        alergias: dados.alergias,
        comorbidades: dados.comorbidades,
        observacoes: dados.observacoes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return paraDominio(data);
  },

  async excluir(id) {
    const supabase = await createClient();
    const { error } = await supabase.from("pacientes").delete().eq("id", id);
    if (error) throw error;
  },

  async buscarHistorico(pacienteId) {
    const supabase = await createClient();

    const [{ data: consultas, error: erroConsultas }, { data: exames, error: erroExames }] = await Promise.all([
      supabase
        .from("consultas")
        .select("id, motivo_consulta, resumo, status, data_hora")
        .eq("paciente_id", pacienteId),
      supabase
        .from("exames")
        .select("id, tipo_exame, observacoes, data_exame, created_at")
        .eq("paciente_id", pacienteId),
    ]);

    if (erroConsultas) throw erroConsultas;
    if (erroExames) throw erroExames;

    const entradasConsultas: EntradaHistorico[] = (consultas ?? []).map((c) => ({
      id: `consulta_${c.id}`,
      pacienteId,
      tipo: "consulta",
      titulo: c.motivo_consulta || "Consulta",
      descricao:
        c.resumo ||
        (c.status === "concluida" ? "Consulta concluída." : "Consulta registrada."),
      data: c.data_hora,
    }));

    const entradasExames: EntradaHistorico[] = (exames ?? []).map((e) => ({
      id: `exame_${e.id}`,
      pacienteId,
      tipo: "exame",
      titulo: e.tipo_exame || "Exame",
      descricao: e.observacoes || "Exame registrado.",
      data: e.data_exame ?? e.created_at,
    }));

    return [...entradasConsultas, ...entradasExames].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  },
};
