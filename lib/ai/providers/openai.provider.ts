import "server-only";
import OpenAI, { toFile } from "openai";
import type { AIProvider, ResultadoSOAP } from "@/lib/ai/types";
import { carregarPrompt, preencherPrompt } from "@/lib/ai/prompts/carregar";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Nomes de modelo isolados em constantes (e sobrescrevíveis por variável
 * de ambiente) de propósito: o catálogo de modelos da OpenAI muda com
 * frequência. Se um modelo for descontinuado, corrige-se aqui — ou só
 * definindo a variável de ambiente — sem tocar no resto do código.
 */
const MODELO_TRANSCRICAO = process.env.OPENAI_MODELO_TRANSCRICAO || "whisper-1";
const MODELO_CHAT = process.env.OPENAI_MODELO_CHAT || "gpt-5-mini";

function obterClienteOpenAI() {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "[AIService/OpenAI] OPENAI_API_KEY não configurada. Defina a variável de ambiente no servidor."
    );
  }
  return new OpenAI({ apiKey: OPENAI_API_KEY });
}

async function baixarAudio(audioUrl: string): Promise<Buffer> {
  const resposta = await fetch(audioUrl);
  if (!resposta.ok) {
    throw new Error(`[AIService/OpenAI] Não foi possível baixar o áudio (status ${resposta.status}).`);
  }
  const arrayBuffer = await resposta.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export const openAIProvider: AIProvider = {
  async transcreverAudio(audioUrl) {
    const client = obterClienteOpenAI();
    const bufferAudio = await baixarAudio(audioUrl);
    const arquivo = await toFile(bufferAudio, "consulta.webm");

    const resultado = await client.audio.transcriptions.create({
      file: arquivo,
      model: MODELO_TRANSCRICAO,
      language: "pt",
    });

    return { texto: resultado.text };
  },

  async gerarSOAP(transcricao) {
    const client = obterClienteOpenAI();
    const systemPrompt = carregarPrompt("system");
    const soapPrompt = preencherPrompt(carregarPrompt("soap"), { transcricao });

    const resposta = await client.chat.completions.create({
      model: MODELO_CHAT,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: soapPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const conteudo = resposta.choices[0]?.message?.content;
    if (!conteudo) {
      throw new Error("[AIService/OpenAI] gerarSOAP() não retornou conteúdo.");
    }

    const json = JSON.parse(conteudo) as Partial<ResultadoSOAP>;
    // Defensivo: se o modelo não retornar pontosParaConfirmar (ou vier
    // em formato inesperado), não deixa o campo undefined chegar ao
    // resto do sistema — trata como "nada a confirmar".
    return {
      subjetivo: json.subjetivo ?? "Não informado.",
      objetivo: json.objetivo ?? "Não informado.",
      avaliacao: json.avaliacao ?? "Não informada.",
      plano: json.plano ?? "Não informado.",
      pontosParaConfirmar: Array.isArray(json.pontosParaConfirmar) ? json.pontosParaConfirmar : [],
    };
  },

  async gerarResumo(transcricaoOuSoap) {
    const client = obterClienteOpenAI();
    const systemPrompt = carregarPrompt("system");
    const resumoPrompt = preencherPrompt(carregarPrompt("resumo-consulta"), {
      transcricaoOuSoap,
    });

    const resposta = await client.chat.completions.create({
      model: MODELO_CHAT,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: resumoPrompt },
      ],
    });

    const conteudo = resposta.choices[0]?.message?.content;
    if (!conteudo) {
      throw new Error("[AIService/OpenAI] gerarResumo() não retornou conteúdo.");
    }

    return conteudo.trim();
  },

  async extrairDadosExame(arquivoUrl, origem) {
    // Ainda não implementado — módulo de Exames (OCR) fica para uma
    // próxima etapa, fora do escopo desta implementação de áudio.
    void arquivoUrl;
    void origem;
    throw new Error(
      "[AIService/OpenAI] extrairDadosExame() ainda não implementado (módulo de Exames)."
    );
  },
};
