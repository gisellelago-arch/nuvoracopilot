import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/api/errors";
import type { UnidadeRepository } from "@/lib/data/types";
import type { Unidade, TipoUnidade } from "@/types/unidade";
import type { Database } from "@/types/database";

type UnidadeRow = Database["public"]["Tables"]["unidades"]["Row"];

function paraDominio(row: UnidadeRow): Unidade {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo as TipoUnidade,
    criadaEm: row.created_at,
  };
}

async function obterUserIdAutenticado(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UnauthorizedError();
  return user.id;
}

export const unidadeRepositorySupabase: UnidadeRepository = {
  async listar() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("unidades")
      .select("*")
      .order("nome", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(paraDominio);
  },

  async buscarPorId(id) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("unidades").select("*").eq("id", id).maybeSingle();

    if (error) throw error;
    return data ? paraDominio(data) : null;
  },

  async criar(dados) {
    const supabase = await createClient();
    const userId = await obterUserIdAutenticado(supabase);

    const { data, error } = await supabase
      .from("unidades")
      .insert({ user_id: userId, nome: dados.nome, tipo: dados.tipo })
      .select()
      .single();

    if (error) throw error;
    return paraDominio(data);
  },

  async atualizar(id, dados) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("unidades")
      .update({ nome: dados.nome, tipo: dados.tipo, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return paraDominio(data);
  },

  async excluir(id) {
    const supabase = await createClient();
    const { error } = await supabase.from("unidades").delete().eq("id", id);
    if (error) {
      // 23503 = violação de chave estrangeira. Como `consultas.unidade_id`
      // usa "on delete restrict", o Postgres recusa a exclusão de uma
      // unidade que já tem consultas vinculadas. Traduzimos isso para uma
      // mensagem amigável em vez de deixar o erro bruto do banco vazar.
      if (error.code === "23503") {
        throw new Error("UNIDADE_EM_USO");
      }
      throw error;
    }
  },
};
