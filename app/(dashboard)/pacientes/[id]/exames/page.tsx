import { FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { exameRepository } from "@/lib/data";
import { formatarData } from "@/lib/utils/date";

const statusVariant = {
  processando: "warning",
  concluido: "success",
  erro: "destructive",
} as const;

export default async function PacienteExamesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exames = await exameRepository.listarPorPaciente(id);

  return (
    <Card>
      <CardContent className="p-5">
        {exames.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            title="Nenhum exame registrado para este paciente"
            description="O envio de exames pelo médico ainda não está disponível nesta versão. Exames aparecem aqui quando cadastrados diretamente no sistema."
          />
        ) : (
          <div className="divide-y divide-border">
            {exames.map((exame) => (
              <div key={exame.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">{exame.tipoExame}</p>
                  <p className="text-xs text-muted-foreground">
                    {exame.observacoes ?? "Sem observações"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-data text-xs text-muted-foreground">
                    {exame.dataExame ? formatarData(exame.dataExame) : "—"}
                  </span>
                  <Badge variant={statusVariant[exame.status]}>{exame.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
