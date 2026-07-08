import "server-only";
import type { AIProvider } from "@/lib/ai/types";

/**
 * A chave da OpenAI pertence ao NuvoraCopilot, não ao médico.
 * É lida apenas aqui, de uma variável de ambiente do servidor (sem prefixo
 * NEXT_PUBLIC_), e nunca chega ao bundle do cliente graças ao import
 * "server-only" acima — qualquer tentativa de importar este arquivo de um
 * Client Component quebra o build imediatamente, de propósito.
 */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function garantirChaveConfigurada() {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "[AIService/OpenAI] OPENAI_API_KEY não configurada. Defina a variável de ambiente no servidor."
    );
  }
}

/**
 * Implementação OpenAI do AIProvider.
 *
 * NENHUM método faz chamadas reais ainda — cada um lança um erro
 * explícito. Isso é intencional: a arquitetura está pronta para receber
 * a integração (Whisper, GPT-4o, Vision) em um módulo futuro dedicado,
 * sem que nenhuma outra parte do sistema precise mudar.
 */
export const openAIProvider: AIProvider = {
  async transcreverAudio(audioUrl) {
    garantirChaveConfigurada();
    void audioUrl;
    // Prompt de sistema: lib/ai/prompts/system.md (Whisper não usa prompt
    // de tarefa — é transcrição direta de áudio).
    throw new Error(
      "[AIService/OpenAI] transcreverAudio() ainda não implementado (integração Whisper prevista para módulo de IA)."
    );
  },

  async gerarSOAP(transcricao) {
    garantirChaveConfigurada();
    void transcricao;
    // Prompt de tarefa: lib/ai/prompts/soap.md
    throw new Error(
      "[AIService/OpenAI] gerarSOAP() ainda não implementado (integração GPT-4o prevista para módulo de IA)."
    );
  },

  async gerarResumo(transcricaoOuSoap) {
    garantirChaveConfigurada();
    void transcricaoOuSoap;
    // Prompt de tarefa: lib/ai/prompts/resumo-consulta.md
    throw new Error(
      "[AIService/OpenAI] gerarResumo() ainda não implementado (integração GPT-4o prevista para módulo de IA)."
    );
  },

  async extrairDadosExame(arquivoUrl, origem) {
    garantirChaveConfigurada();
    void arquivoUrl;
    void origem;
    // Prompt de tarefa: lib/ai/prompts/exames.md
    throw new Error(
      "[AIService/OpenAI] extrairDadosExame() ainda não implementado (integração GPT-4o Vision prevista para módulo de IA)."
    );
  },
};
