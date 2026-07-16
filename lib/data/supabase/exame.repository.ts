import { createClient } from "@/lib/supabase/server";
import type { ExameRepository } from "@/lib/data/types";
import type { Exame, OrigemExame, StatusExame } from "@/types/exame";
import type { Database } from "@/types/database";

type ExameRow = Database["public"]["Tables"]["exames"]["Row"];
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function anexarNomePaciente(supabase: SupabaseClient, rows: ExameRow[]): Promise<Exame[]> {
  if (rows.length === 0) return [];

  const pacienteIds = [...new Set(rows.map((r) => r.paciente_id))];
  const { data: pacientes } = await supabase.from("pacientes").select("id, nome").in("id", pacienteIds);
  const nomePaciente = new Map((pacientes ?? []).map((p) => [p.id, p.nome]));

  return rows.map((row) => ({
    id: row.id,
    pacienteId: row.paciente_id,
    pacienteNome: nomePaciente.get(row.paciente_id) ?? "Paciente",
    consultaId: row.consulta_id,
    tipoExame: row.tipo_exame ?? "Exame",
    origem: row.origem as OrigemExame,
    status: row.status as StatusExame,
    arquivoUrl: row.arquivo_url,
    dataExame: row.data_exame ?? row.created_at,
    enviadoEm: row.created_at,
    observacoes: row.observacoes,
  }));
}

export const exameRepositorySupabase: ExameRepository = {
  async listar() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exames")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return anexarNomePaciente(supabase, data ?? []);
  },

  async listarPorPaciente(pacienteId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exames")
      .select("*")
      .eq("paciente_id", pacienteId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return anexarNomePaciente(supabase, data ?? []);
  },

  async buscarPorId(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("exames").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const [exame] = await anexarNomePaciente(supabase, [data]);
    return exame ?? null;
  },

  async listarPorConsulta(consultaId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exames")
      .select("*")
      .eq("consulta_id", consultaId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return anexarNomePaciente(supabase, data ?? []);
  },
};
