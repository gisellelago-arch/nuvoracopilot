import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { validarEnvSupabase } from "./validar-env";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  validarEnvSupabase(url, anonKey);

  return createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Chamado a partir de um Server Component — pode ser ignorado
          // se houver middleware atualizando a sessão.
        }
      },
    },
  });
}
