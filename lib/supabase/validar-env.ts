/**
 * Valida o formato de NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
 * antes de qualquer tentativa de conexão. Existe porque um erro de
 * configuração aqui (URL sem "https://", ou o texto de exemplo esquecido
 * no .env.local) antes só aparecia como "fetch failed" / "ENOTFOUND" — um
 * erro de rede genérico e difícil de diagnosticar. Agora falha na hora,
 * com uma mensagem que aponta exatamente o problema.
 */
export function validarEnvSupabase(url: string | undefined, anonKey: string | undefined) {
  const erros: string[] = [];

  if (!url) {
    erros.push("NEXT_PUBLIC_SUPABASE_URL não está definida no .env.local.");
  } else {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      erros.push(
        `NEXT_PUBLIC_SUPABASE_URL está sem "https://" na frente. Valor atual: "${url}". ` +
          `Deveria ser algo como "https://${url}".`
      );
    }
    if (url.includes("seu-projeto")) {
      erros.push(
        'NEXT_PUBLIC_SUPABASE_URL ainda está com o texto de exemplo ("seu-projeto.supabase.co") — ' +
          "substitua pela URL real do seu projeto (Project Settings > API no painel do Supabase)."
      );
    }
  }

  if (!anonKey) {
    erros.push("NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida no .env.local.");
  }

  if (erros.length > 0) {
    throw new Error(
      `[Configuração do Supabase inválida]\n${erros.map((e) => `  - ${e}`).join("\n")}\n` +
        `Confira o arquivo .env.local na raiz do projeto.`
    );
  }
}
