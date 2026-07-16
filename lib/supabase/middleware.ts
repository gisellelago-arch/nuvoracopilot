import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { validarEnvSupabase } from "./validar-env";

const ROTAS_PUBLICAS = ["/login", "/register", "/auth/callback", "/esqueci-senha"];
// Observação: "/redefinir-senha" é protegida de propósito (fica de fora desta
// lista). Ela só deve ser acessível com uma sessão de recuperação válida,
// criada por /auth/callback ao trocar o code do e-mail de recuperação. Um
// visitante sem essa sessão é corretamente redirecionado para /login.

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  validarEnvSupabase(supabaseUrl, supabaseAnonKey);

  const supabase = createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
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
  });

  let user = null;
  try {
    const {
      data: { user: usuarioAutenticado },
    } = await supabase.auth.getUser();
    user = usuarioAutenticado;
  } catch (erro) {
    // Se o Supabase estiver temporariamente inalcançável, tratamos como
    // "sem sessão" (mais seguro) em vez de derrubar todas as rotas do
    // site com um erro 500 não tratado.
    console.error("[middleware] Falha ao verificar sessão com o Supabase:", erro);
  }

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
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (path === "/login" || path === "/register")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
