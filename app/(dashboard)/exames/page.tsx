import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { exameRepository } from "@/lib/data";
import { formatarData } from "@/lib/utils/date";

const statusVariant = {
  processando: "warning",
  concluido: "success",
  erro: "destructive",
} as const;

export default async function ExamesPage() {
  const exames = await exameRepository.listar();

  return (
    <div>
      <PageHeader
        title="Exames"
        description="Todos os exames organizados, de todos os seus pacientes."
      />

      <Card>
        <CardContent className="p-5">
          {exames.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="Nenhum exame cadastrado ainda"
              description="O envio de exames pelo médico ainda não está disponível nesta versão. Exames aparecem aqui quando cadastrados diretamente no sistema."
            />
          ) : (
            <div className="divide-y divide-border">
              {exames.map((exame) => (
                <Link
                  key={exame.id}
                  href={`/pacientes/${exame.pacienteId}/exames`}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{exame.tipoExame}</p>
                    <p className="text-xs text-muted-foreground">{exame.pacienteNome}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular-data text-xs text-muted-foreground">
                      {formatarData(exame.dataExame)}
                    </span>
                    <Badge variant={statusVariant[exame.status]}>{exame.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
