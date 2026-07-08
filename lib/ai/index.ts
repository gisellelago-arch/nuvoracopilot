import "server-only";

/**
 * Barrel do módulo de IA. Todo consumidor externo importa daqui —
 * `import { aiService } from "@/lib/ai"` — nunca de `ai-service.ts`,
 * `providers/*` ou `types.ts` diretamente. Isso mantém a estrutura
 * interna livre para ser reorganizada sem quebrar quem consome.
 */
export { aiService } from "./ai-service";
export type {
  AIProvider,
  ResultadoTranscricao,
  ResultadoSOAP,
  ResultadoExtracaoExame,
} from "./types";
