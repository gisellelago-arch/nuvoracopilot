import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultaStatusBadge } from "@/components/consulta/consulta-status-badge";
import { obterIniciais } from "@/lib/utils/format";
import { formatarDataHora } from "@/lib/utils/date";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Consulta } from "@/types/consulta";

export function ConsultasRecentes({ consultas }: { consultas: Consulta[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Próximas consultas</CardTitle>
        <Link href="/consultas/nova" className="text-xs font-medium text-primary hover:underline">
          Nova consulta
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {consultas.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhuma consulta agendada"
            description="Suas próximas consultas aparecerão aqui."
          />
        ) : (
          <ul className="divide-y divide-border">
            {consultas.map((consulta) => (
              <li key={consulta.id} className="first:pt-0 last:pb-0">
                <Link
                  href={`/consultas/${consulta.id}`}
                  className="-mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{obterIniciais(consulta.pacienteNome)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{consulta.pacienteNome}</p>
                      <p className="text-xs text-muted-foreground">{consulta.motivoConsulta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular-data text-xs text-muted-foreground">
                      {formatarDataHora(consulta.dataHora)}
                    </span>
                    <ConsultaStatusBadge status={consulta.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
