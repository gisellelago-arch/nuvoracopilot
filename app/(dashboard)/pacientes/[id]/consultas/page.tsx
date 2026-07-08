import { CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultaStatusBadge } from "@/components/consulta/consulta-status-badge";
import { consultaRepository } from "@/lib/data";
import { formatarDataHora } from "@/lib/utils/date";

export default async function PacienteConsultasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consultas = await consultaRepository.listarPorPaciente(id);

  return (
    <Card>
      <CardContent className="p-5">
        {consultas.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nenhuma consulta registrada para este paciente" />
        ) : (
          <div className="divide-y divide-border">
            {consultas.map((consulta) => (
              <div key={consulta.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">{consulta.motivoConsulta}</p>
                  <p className="text-xs text-muted-foreground">{consulta.unidadeNome}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-data text-xs text-muted-foreground">
                    {formatarDataHora(consulta.dataHora)}
                  </span>
                  <ConsultaStatusBadge status={consulta.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
