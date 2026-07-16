"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface PacienteTabsProps {
  pacienteId: string;
}

export function PacienteTabs({ pacienteId }: PacienteTabsProps) {
  const pathname = usePathname();
  const base = `/pacientes/${pacienteId}`;

  const abas = [
    { href: base, label: "Resumo" },
    { href: `${base}/consultas`, label: "Consultas" },
    { href: `${base}/exames`, label: "Exames" },
    { href: `${base}/documentos`, label: "Documentos" },
  ];

  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex gap-1">
        {abas.map((aba) => {
          const ativa = pathname === aba.href;
          return (
            <Link
              key={aba.href}
              href={aba.href}
              className={cn(
                "border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                ativa
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {aba.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
