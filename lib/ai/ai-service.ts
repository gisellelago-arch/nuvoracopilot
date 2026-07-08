import "server-only";
import { openAIProvider } from "./providers/openai.provider";
import type { AIProvider } from "./types";

/**
 * AI Service — gateway único de IA do NuvoraCopilot.
 *
 * REGRA DE OURO: nenhum componente, página ou Server Action chama um
 * provedor de IA diretamente. Tudo passa por `aiService`, importado
 * daqui (via `lib/ai`). Isso garante três coisas:
 *
 *   1. A chave de API nunca vaza para o código do cliente (o pacote
 *      "server-only" quebra o build se este arquivo for importado de um
 *      Client Component).
 *   2. Trocar de provedor (OpenAI → Anthropic, Gemini, um modelo local)
 *      é uma mudança de uma linha aqui embaixo — nenhum outro arquivo do
 *      projeto precisa saber que a troca aconteceu.
 *   3. O médico nunca tem contato com a API do provedor — só o
 *      NuvoraCopilot tem a conta e a chave.
 *
 * Consumo: exclusivamente pelas rotas de API (`app/api/**`), nunca
 * diretamente por Server Actions ou componentes — ver
 * docs/ARQUITETURA_IA.md e docs/ARQUITETURA_API.md.
 *
 * Os prompts usados por cada operação ficam versionados como texto puro
 * em `lib/ai/prompts/*.md`, separados do código — ver essa pasta para
 * editar o comportamento de cada tarefa sem tocar em TypeScript.
 *
 * Para trocar de provedor no futuro:
 *
 *   1. Criar lib/ai/providers/anthropic.provider.ts implementando AIProvider.
 *   2. Trocar a linha abaixo para exportar esse novo provider.
 *   3. Nenhum outro arquivo muda.
 */
export const aiService: AIProvider = openAIProvider;
