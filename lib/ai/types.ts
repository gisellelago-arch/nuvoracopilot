/**
 * Contrato único de IA do NuvoraCopilot.
 *
 * Qualquer provedor (OpenAI, Anthropic, Gemini, um modelo local, etc.)
 * implementa esta interface. Nenhum outro lugar do sistema conhece o
 * provedor por trás — só conhece estes métodos. Trocar de provedor é
 * trocar qual implementação é exportada em `lib/ai/index.ts`.
 */

export interface ResultadoTranscricao {
  texto: string;
  duracaoSegundos?: number;
}

export interface ResultadoSOAP {
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
  /**
   * Informações potencialmente relevantes, porém ambíguas na
   * transcrição (ex: evento sem sintoma associado claro), que o
   * médico pode querer confirmar com o paciente. Nunca contém
   * conversa social — essa é eliminada totalmente, não relocada
   * para cá. Lista vazia quando não há nada a confirmar.
   */
  pontosParaConfirmar: string[];
}

export interface ResultadoExtracaoExame {
  tipoExame: string | null;
  dataExame: string | null;
  /** Pares chave/valor extraídos do exame (ex: { "Glicemia": "98 mg/dL" }). */
  valoresEstruturados: Record<string, string> | null;
  textoExtraido: string;
}

export interface AIProvider {
  /** Transcreve o áudio de uma consulta a partir da URL do arquivo. */
  transcreverAudio(audioUrl: string): Promise<ResultadoTranscricao>;

  /** Gera a evolução em formato SOAP a partir da transcrição da consulta. */
  gerarSOAP(transcricao: string): Promise<ResultadoSOAP>;

  /** Gera um resumo curto e legível da consulta (transcrição ou SOAP). */
  gerarResumo(transcricaoOuSoap: string): Promise<string>;

  /** Extrai dados estruturados de um exame fotografado, em PDF ou por áudio. */
  extrairDadosExame(
    arquivoUrl: string,
    origem: "foto" | "pdf" | "audio"
  ): Promise<ResultadoExtracaoExame>;
}
