"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pacienteRepository } from "@/lib/data";
import { pacienteSchema } from "@/lib/validators/paciente.schema";

export interface PacienteActionState {
  erro?: string;
}

/**
 * Código de erro do Postgres para violação de unicidade (ex: o índice
 * único de user_id+cpf criado na migration 002). Traduzimos isso para
 * uma mensagem amigável em vez de deixar o erro bruto do banco vazar.
 */
function ehErroDeCpfDuplicado(erro: unknown): boolean {
  return (
    typeof erro === "object" &&
    erro !== null &&
    "code" in erro &&
    (erro as { code?: string }).code === "23505"
  );
}

function extrairDadosFormulario(formData: FormData) {
  return {
    nome: formData.get("nome"),
    cpf: formData.get("cpf"),
    dataNascimento: formData.get("dataNascimento"),
    sexo: formData.get("sexo"),
    telefone: formData.get("telefone"),
    email: formData.get("email"),
    endereco: formData.get("endereco"),
    cidade: formData.get("cidade"),
    estado: formData.get("estado"),
    convenio: formData.get("convenio"),
    alergias: formData.get("alergias"),
    comorbidades: formData.get("comorbidades"),
    observacoes: formData.get("observacoes"),
  };
}

export async function criarPaciente(
  _estadoAnterior: PacienteActionState,
  formData: FormData
): Promise<PacienteActionState> {
  const resultado = pacienteSchema.safeParse(extrairDadosFormulario(formData));

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  let paciente;
  try {
    paciente = await pacienteRepository.criar({
      ...resultado.data,
      email: resultado.data.email ?? null,
      endereco: resultado.data.endereco || null,
      cidade: resultado.data.cidade || null,
      estado: resultado.data.estado || null,
      convenio: resultado.data.convenio || null,
      observacoes: resultado.data.observacoes || null,
    });
  } catch (erro) {
    if (ehErroDeCpfDuplicado(erro)) {
      return { erro: "Já existe um paciente cadastrado com este CPF." };
    }
    console.error("[criarPaciente] Erro inesperado:", erro);
    return { erro: "Não foi possível cadastrar o paciente. Tente novamente." };
  }

  revalidatePath("/pacientes");
  redirect(`/pacientes/${paciente.id}`);
}

export async function atualizarPaciente(
  id: string,
  _estadoAnterior: PacienteActionState,
  formData: FormData
): Promise<PacienteActionState> {
  const resultado = pacienteSchema.safeParse(extrairDadosFormulario(formData));

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  try {
    await pacienteRepository.atualizar(id, {
      ...resultado.data,
      email: resultado.data.email ?? null,
      endereco: resultado.data.endereco || null,
      cidade: resultado.data.cidade || null,
      estado: resultado.data.estado || null,
      convenio: resultado.data.convenio || null,
      observacoes: resultado.data.observacoes || null,
    });
  } catch (erro) {
    if (ehErroDeCpfDuplicado(erro)) {
      return { erro: "Já existe outro paciente cadastrado com este CPF." };
    }
    console.error("[atualizarPaciente] Erro inesperado:", erro);
    return { erro: "Não foi possível salvar as alterações. Tente novamente." };
  }

  revalidatePath("/pacientes");
  revalidatePath(`/pacientes/${id}`);
  redirect(`/pacientes/${id}`);
}

export async function excluirPaciente(id: string) {
  await pacienteRepository.excluir(id);
  revalidatePath("/pacientes");
  redirect("/pacientes");
}
