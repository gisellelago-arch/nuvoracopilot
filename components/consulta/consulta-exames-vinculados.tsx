import { FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatarData } from "@/lib/utils/date";
import type { Exame } from "@/types/exame";

const statusVariant = {
  processando: "warning",
  concluido: "success",
  erro: "destructive",
} as const;

export function ConsultaExamesVinculados({ exames }: { exames: Exame[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <FlaskConical className="h-4 w-4 text-muted-foreground" />
        <CardTitle>Exames vinculados</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {exames.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum exame vinculado a esta consulta.</p>
        ) : (
          <div className="divide-y divide-border">
            {exames.map((exame) => (
              <div key={exame.id} className="flex items-center justify-between gap-4 py-2.5">
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
