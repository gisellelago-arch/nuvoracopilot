"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FilePlus2,
  FlaskConical,
  Settings,
  Stethoscope,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const itensNavegacao = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/consultas/nova", label: "Nova consulta", icon: FilePlus2 },
  { href: "/exames", label: "Exames", icon: FlaskConical },
  { href: "/unidades", label: "Unidades", icon: Building2 },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <Stethoscope className="h-4.5 w-4.5 text-primary" strokeWidth={2.2} />
        <span className="text-sm font-semibold tracking-tight">NuvoraCopilot</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {itensNavegacao.map((item) => {
          const ativo =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                ativo
                  ? "bg-sidebar-active text-primary"
                  : "text-sidebar-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="px-3 text-xs text-muted-foreground">
          Todas as decisões clínicas são de sua responsabilidade.
        </p>
      </div>
    </aside>
  );
}
