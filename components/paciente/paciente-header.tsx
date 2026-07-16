import Link from "next/link";
import { Pencil, Trash2, AlertTriangle, Mic } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { excluirPaciente } from "@/lib/actions/paciente.actions";
import { obterIniciais, formatarCPF, formatarTelefone } from "@/lib/utils/format";
import { calcularIdade } from "@/lib/utils/date";
import type { Paciente } from "@/types/paciente";

export function PacienteHeader({ paciente }: { paciente: Paciente }) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-base">{obterIniciais(paciente.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{paciente.nome}</h1>
            <p className="tabular-data text-sm text-muted-foreground">
              {formatarCPF(paciente.cpf)} · {calcularIdade(paciente.dataNascimento)} anos ·{" "}
              {formatarTelefone(paciente.telefone)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button asChild size="sm">
            <Link href={`/consultas/nova?pacienteId=${paciente.id}`}>
              <Mic className="h-4 w-4" /> Nova consulta
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/pacientes/${paciente.id}/editar`}>
              <Pencil className="h-4 w-4" /> Editar
            </Link>
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" /> Excluir
              </Button>
            }
            title="Excluir paciente"
            description={`Esta ação remove permanentemente a ficha de "${paciente.nome}", incluindo histórico de consultas e exames vinculados. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?`}
            confirmLabel="Sim, excluir permanentemente"
            action={excluirPaciente.bind(null, paciente.id)}
          />
        </div>
      </div>

      {(paciente.alergias.length > 0 || paciente.comorbidades.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {paciente.alergias.map((alergia) => (
            <Badge key={alergia} variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" /> {alergia}
            </Badge>
          ))}
          {paciente.comorbidades.map((comorbidade) => (
            <Badge key={comorbidade} variant="outline">
              {comorbidade}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
