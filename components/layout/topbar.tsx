import { UserMenu } from "@/components/layout/user-menu";
import { MobileNav } from "@/components/layout/mobile-nav";

interface TopbarProps {
  medico: { nome: string; crm: string; crmUf: string };
}

export function Topbar({ medico }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <MobileNav />
      <UserMenu nome={medico.nome} crm={medico.crm} crmUf={medico.crmUf} />
    </header>
  );
}
