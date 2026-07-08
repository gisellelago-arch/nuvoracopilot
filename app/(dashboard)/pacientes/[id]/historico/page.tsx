import { History, Stethoscope, FlaskConical, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { pacienteRepository } from "@/lib/data";
import { formatarDataHora } from "@/lib/utils/date";
import type { EntradaHistorico } from "@/types/paciente";

const iconePorTipo: Record<EntradaHistorico["tipo"], typeof Stethoscope> = {
  consulta: Stethoscope,
  exame: FlaskConical,
  anotacao: FileText,
};

export default async function PacienteHistoricoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const historico = await pacienteRepository.buscarHistorico(id);

  const historicoOrdenado = [...historico].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <Card>
      <CardContent className="p-5">
        {historicoOrdenado.length === 0 ? (
          <EmptyState icon={History} title="Nenhum evento no histórico deste paciente" />
        ) : (
          <ol className="space-y-5">
            {historicoOrdenado.map((entrada) => {
              const Icone = iconePorTipo[entrada.tipo];
              return (
                <li key={entrada.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icone className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="flex-1 border-b border-border pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium">{entrada.titulo}</p>
                      <span className="tabular-data shrink-0 text-xs text-muted-foreground">
                        {formatarDataHora(entrada.data)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{entrada.descricao}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
