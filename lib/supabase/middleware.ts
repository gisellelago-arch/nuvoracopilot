import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const ROTAS_PUBLICAS = ["/login", "/register", "/auth/callback", "/esqueci-senha"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Rotas de API nunca são redirecionadas para /login: um cliente que
  // chama fetch("/api/...") sem sessão deve receber um 401 em JSON (ver
  // lib/api/auth.ts), não uma página HTML de login. A sessão já foi
  // atualizada acima (supabaseResponse), então a rota consegue ler o
  // usuário normalmente via createClient() do lado do servidor.
  if (path.startsWith("/api/")) {
    return supabaseResponse;
  }

  const isRotaPublica = ROTAS_PUBLICAS.some((rota) => path.startsWith(rota));

  if (!user && !isRotaPublica) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && (path === "/login" || path === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
