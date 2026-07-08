import { createClient } from "@/lib/supabase/server";
import type { MedicoRepository } from "@/lib/data/types";
import type { Medico } from "@/types/medico";
import type { Database } from "@/types/database";

function paraDominio(row: {
  id: string;
  user_id: string;
  nome: string;
  crm: string;
  crm_uf: string;
  especialidade: string | null;
  telefone: string | null;
  created_at: string;
}): Medico {
  return {
    id: row.id,
    userId: row.user_id,
    nome: row.nome,
    crm: row.crm,
    crmUf: row.crm_uf,
    especialidade: row.especialidade,
    telefone: row.telefone,
    createdAt: row.created_at,
  };
}

export const medicoRepositorySupabase: MedicoRepository = {
  async buscarPorUserId(userId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("medicos")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data ? paraDominio(data) : null;
  },

  async atualizar(userId, dados) {
    const supabase = await createClient();

    const payload: Database["public"]["Tables"]["medicos"]["Update"] = {
      updated_at: new Date().toISOString(),
    };
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.crm !== undefined) payload.crm = dados.crm;
    if (dados.crmUf !== undefined) payload.crm_uf = dados.crmUf;
    if (dados.especialidade !== undefined) payload.especialidade = dados.especialidade;
    if (dados.telefone !== undefined) payload.telefone = dados.telefone;

    const { data, error } = await supabase
      .from("medicos")
      .update(payload)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return paraDominio(data);
  },
};
