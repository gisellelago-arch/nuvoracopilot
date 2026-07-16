import Link from "next/link";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirUnidade } from "@/lib/actions/unidade.actions";
import { rotuloTipoUnidade, type Unidade } from "@/types/unidade";

export function UnidadeRow({ unidade }: { unidade: Unidade }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Building2 className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium">{unidade.nome}</p>
          <Badge variant="outline" className="mt-0.5">
            {rotuloTipoUnidade[unidade.tipo]}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/unidades/${unidade.id}/editar`} aria-label={`Editar ${unidade.nome}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon" aria-label={`Excluir ${unidade.nome}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          }
          title="Excluir unidade"
          description={`Tem certeza que deseja excluir "${unidade.nome}"? Só é possível excluir unidades sem consultas registradas.`}
          confirmLabel="Excluir"
          action={excluirUnidade.bind(null, unidade.id)}
        />
      </div>
    </div>
  );
}
