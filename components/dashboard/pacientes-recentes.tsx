import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { obterIniciais } from "@/lib/utils/format";
import { formatarTempoRelativo } from "@/lib/utils/date";
import type { Paciente } from "@/types/paciente";

export function PacientesRecentes({ pacientes }: { pacientes: Paciente[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Pacientes recentes</CardTitle>
        <Link href="/pacientes" className="text-xs font-medium text-primary hover:underline">
          Ver todos
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {pacientes.length === 0 ? (
          <EmptyState icon={Users} title="Nenhum paciente cadastrado ainda" />
        ) : (
          <ul className="divide-y divide-border">
            {pacientes.map((paciente) => (
              <li key={paciente.id}>
                <Link
                  href={`/pacientes/${paciente.id}`}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{obterIniciais(paciente.nome)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{paciente.nome}</p>
                      <p className="text-xs text-muted-foreground">{paciente.convenio ?? "Particular"}</p>
                    </div>
                  </div>
                  {paciente.ultimaConsultaEm && (
                    <span className="text-xs text-muted-foreground">
                      {formatarTempoRelativo(paciente.ultimaConsultaEm)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
