"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  FlaskConical,
  Settings,
  Stethoscope,
  Building2,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";

const itensNavegacao = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/consultas/nova", label: "Nova consulta", icon: FilePlus2 },
  { href: "/exames", label: "Exames", icon: FlaskConical },
  { href: "/unidades", label: "Unidades", icon: Building2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="left-0 top-0 h-full w-72 max-w-[80vw] translate-x-0 translate-y-0 rounded-none border-r p-0">
        <DialogTitle className="sr-only">Menu de navegação</DialogTitle>
        <div className="flex h-14 items-center gap-2 border-b border-border px-5">
          <Stethoscope className="h-4.5 w-4.5 text-primary" strokeWidth={2.2} />
          <span className="text-sm font-semibold tracking-tight">NuvoraCopilot</span>
        </div>

        <nav className="space-y-0.5 p-3">
          {itensNavegacao.map((item) => {
            const ativo =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  ativo ? "bg-sidebar-active text-primary" : "text-sidebar-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
