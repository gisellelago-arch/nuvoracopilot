"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { consultaRepository, pacienteRepository, unidadeRepository } from "@/lib/data";

export interface ConsultaActionState {
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

export async function finalizarConsultaAction(id: string, formData: FormData) {
  const duracaoSegundos = Number(formData.get("duracaoSegundos") ?? 0);
  const observacoes = formData.get("observacoes");

  if (typeof observacoes === "string") {
    await consultaRepository.atualizarObservacoes(id, observacoes);
  }

  await consultaRepository.finalizar(id, {
    duracaoMinutos: Math.max(1, Math.round(duracaoSegundos / 60)),
  });

  // TODO (módulo de IA): quando o áudio real estiver disponível, disparar
  // aqui (ou via fila/n8n) aiService.transcreverAudio() → aiService.gerarSOAP()
  // → aiService.gerarResumo(), e salvar os resultados na consulta. Nenhuma
  // outra parte do sistema precisa mudar quando isso for implementado —
  // ver lib/ai/index.ts.

  revalidatePath(`/consultas/${id}`);
  revalidatePath("/dashboard");
  redirect(`/consultas/${id}`);
}
