import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { medicoRepository } from "@/lib/data";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const medico = await medicoRepository.buscarPorUserId(user.id);

  // Enquanto o trigger de auto-provisionamento não finalizou (raríssimo, mas
  // possível em race conditions), evita quebrar a tela com dados vazios.
  const perfilExibido = medico ?? {
    nome: user.email?.split("@")[0] ?? "Médico(a)",
    crm: "—",
    crmUf: "—",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar medico={perfilExibido} />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
