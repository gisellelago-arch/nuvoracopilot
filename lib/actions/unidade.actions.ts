"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unidadeRepository } from "@/lib/data";
import { unidadeSchema } from "@/lib/validators/unidade.schema";

export interface UnidadeActionState {
  erro?: string;
}

export async function criarUnidade(
  _estadoAnterior: UnidadeActionState,
  formData: FormData
): Promise<UnidadeActionState> {
  const resultado = unidadeSchema.safeParse({
    nome: formData.get("nome"),
    tipo: formData.get("tipo"),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  await unidadeRepository.criar(resultado.data);
  revalidatePath("/unidades");
  redirect("/unidades");
}

export async function atualizarUnidade(
  id: string,
  _estadoAnterior: UnidadeActionState,
  formData: FormData
): Promise<UnidadeActionState> {
  const resultado = unidadeSchema.safeParse({
    nome: formData.get("nome"),
    tipo: formData.get("tipo"),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  await unidadeRepository.atualizar(id, resultado.data);
  revalidatePath("/unidades");
  redirect("/unidades");
}

export async function excluirUnidade(id: string) {
  await unidadeRepository.excluir(id);
  revalidatePath("/unidades");
}
