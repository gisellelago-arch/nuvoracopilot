"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { consultaRepository, pacienteRepository, unidadeRepository } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { UnauthorizedError } from "@/lib/api/errors";
import { consultaEditarSchema } from "@/lib/validators/consulta.schema";

export interface ConsultaActionState {
  erro?: string;
}

export interface ConsultaEditarActionState {
  erro?: string;
}

export interface FinalizarConsultaState {
  sucesso: boolean;
  erro?: string;
}

export async function iniciarConsultaAgora(
  _estadoAnterior: ConsultaActionState,
  formData: FormData
): Promise<ConsultaActionState> {
  const pacienteId = String(formData.get("pacienteId") ?? "");
  const unidadeId = String(formData.get("unidadeId") ?? "");
  const motivoConsulta = String(formData.get("motivoConsulta") ?? "").trim();

  if (!pacienteId) {
    return { erro: "Selecione o paciente." };
  }
  if (!unidadeId) {
    return { erro: "Selecione a unidade de atendimento." };
  }

  // Buscamos os nomes no servidor (nunca confiamos em nome vindo do form)
  // para garantir consistência mesmo se o dado mudar entre o carregamento
  // da página e o envio do formulário.
  const [paciente, unidade] = await Promise.all([
    pacienteRepository.buscarPorId(pacienteId),
    unidadeRepository.buscarPorId(unidadeId),
  ]);

  if (!paciente) return { erro: "Paciente não encontrado." };
  if (!unidade) return { erro: "Unidade não encontrada." };

  const consulta = await consultaRepository.iniciarAgora({
    pacienteId: paciente.id,
    pacienteNome: paciente.nome,
    unidadeId: unidade.id,
    unidadeNome: unidade.nome,
    motivoConsulta: motivoConsulta || "Consulta",
  });

  revalidatePath("/dashboard");
  redirect(`/consultas/${consulta.id}`);
}

export async function iniciarAtendimentoAction(id: string) {
  await consultaRepository.iniciarAtendimento(id);
  revalidatePath(`/consultas/${id}`);
}

export async function salvarObservacoes(id: string, formData: FormData) {
  const observacoes = String(formData.get("observacoes") ?? "");
  await consultaRepository.atualizarObservacoes(id, observacoes);
  revalidatePath(`/consultas/${id}`);
}

export async function finalizarConsultaAction(
  id: string,
  formData: FormData
): Promise<FinalizarConsultaState> {
  const duracaoSegundos = Number(formData.get("duracaoSegundos") ?? 0);
  const observacoes = formData.get("observacoes");
  const audio = formData.get("audio");

  if (typeof observacoes === "string") {
    await consultaRepository.atualizarObservacoes(id, observacoes);
  }

  let audioUrl: string | null = null;

  if (audio instanceof File && audio.size > 0) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new UnauthorizedError();

    const caminho = `${user.id}/${id}.webm`;
    const { error: erroUpload } = await supabase.storage
      .from("audios-consultas")
      .upload(caminho, audio, { contentType: audio.type || "audio/webm", upsert: true });

    if (erroUpload) {
      console.error("[finalizarConsultaAction] Erro ao subir áudio:", erroUpload);
      return {
        sucesso: false,
        erro: "Não foi possível salvar o áudio da consulta. Tente finalizar novamente em instantes.",
      };
    }

    audioUrl = caminho;
  }

  await consultaRepository.finalizar(id, {
    duracaoMinutos: Math.max(1, Math.round(duracaoSegundos / 60)),
    audioUrl,
  });

  revalidatePath(`/consultas/${id}`);
  revalidatePath("/dashboard");

  return { sucesso: true };
}

/**
 * Edição pontual de uma consulta já registrada (ETAPA 2): corrige tipo,
 * data/horário, unidade, resumo, SOAP e observações. Não grava áudio,
 * não transcreve e não aciona a IA — apenas atualiza os campos já
 * persistidos da consulta selecionada. Nenhuma outra consulta nem o
 * cadastro do paciente são alterados.
 */
export async function editarConsultaAction(
  id: string,
  _estadoAnterior: ConsultaEditarActionState,
  formData: FormData
): Promise<ConsultaEditarActionState> {
  const consultaExistente = await consultaRepository.buscarPorId(id);
  if (!consultaExistente) {
    return { erro: "Consulta não encontrada." };
  }

  const resultado = consultaEditarSchema.safeParse({
    motivoConsulta: String(formData.get("motivoConsulta") ?? "").trim(),
    data: String(formData.get("data") ?? ""),
    hora: String(formData.get("hora") ?? ""),
    unidadeId: String(formData.get("unidadeId") ?? ""),
    resumo: String(formData.get("resumo") ?? ""),
    subjetivo: String(formData.get("subjetivo") ?? ""),
    objetivo: String(formData.get("objetivo") ?? ""),
    avaliacao: String(formData.get("avaliacao") ?? ""),
    plano: String(formData.get("plano") ?? ""),
    observacoes: String(formData.get("observacoes") ?? ""),
  });

  if (!resultado.success) {
    return { erro: resultado.error.issues[0]?.message ?? "Verifique os dados informados." };
  }

  const dados = resultado.data;

  const unidade = await unidadeRepository.buscarPorId(dados.unidadeId);
  if (!unidade) {
    return { erro: "Unidade não encontrada." };
  }

  const dataHoraIso = new Date(`${dados.data}T${dados.hora}`).toISOString();

  const soapPreenchido =
    dados.subjetivo || dados.objetivo || dados.avaliacao || dados.plano
      ? {
          subjetivo: dados.subjetivo ?? "",
          objetivo: dados.objetivo ?? "",
          avaliacao: dados.avaliacao ?? "",
          plano: dados.plano ?? "",
        }
      : consultaExistente.soap;

  await consultaRepository.atualizar(id, {
    motivoConsulta: dados.motivoConsulta,
    dataHora: dataHoraIso,
    unidadeId: dados.unidadeId,
    resumo: dados.resumo || consultaExistente.resumo,
    soap: soapPreenchido,
    observacoes: dados.observacoes || null,
  });

  revalidatePath(`/consultas/${id}`);
  revalidatePath(`/pacientes/${consultaExistente.pacienteId}/consultas`);

  redirect(`/consultas/${id}`);
}
