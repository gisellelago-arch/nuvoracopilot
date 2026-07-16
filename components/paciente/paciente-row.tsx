import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { obterIniciais, formatarCPF } from "@/lib/utils/format";
import { calcularIdade } from "@/lib/utils/date";
import type { Paciente } from "@/types/paciente";

export function PacienteRow({ paciente }: { paciente: Paciente }) {
  return (
    <Link
      href={`/pacientes/${paciente.id}`}
      className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{obterIniciais(paciente.nome)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{paciente.nome}</p>
          <p className="tabular-data text-xs text-muted-foreground">
            {formatarCPF(paciente.cpf)} · {calcularIdade(paciente.dataNascimento)} anos
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {paciente.comorbidades.length > 0 && (
          <Badge variant="outline">{paciente.comorbidades.length} comorbidade(s)</Badge>
        )}
        <Badge variant="secondary">{paciente.convenio ?? "Particular"}</Badge>
      </div>
    </Link>
  );
}
