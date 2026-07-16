import "server-only";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Carrega um prompt de lib/ai/prompts/{nome}.md e remove o comentário
 * HTML de cabeçalho (documentação interna, não deve ir para o modelo).
 *
 * Os arquivos .md são incluídos no bundle de produção via
 * `outputFileTracingIncludes` no next.config.mjs — sem isso, a Vercel
 * poderia não empacotar esses arquivos (eles não são importados como
 * código, só lidos em runtime).
 */
export function carregarPrompt(nome: string): string {
  const caminho = join(process.cwd(), "lib", "ai", "prompts", `${nome}.md`);
  const conteudo = readFileSync(caminho, "utf-8");
  return conteudo.replace(/<!--[\s\S]*?-->/, "").trim();
}

/**
 * Substitui variáveis no formato {{nome}} pelo valor correspondente.
 */
export function preencherPrompt(template: string, variaveis: Record<string, string>): string {
  return Object.entries(variaveis).reduce(
    (texto, [chave, valor]) => texto.replaceAll(`{{${chave}}}`, valor),
    template
  );
}
