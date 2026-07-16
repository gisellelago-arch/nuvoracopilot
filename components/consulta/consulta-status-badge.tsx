import { Badge } from "@/components/ui/badge";
import type { StatusConsulta } from "@/types/consulta";

const config: Record<StatusConsulta, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }> = {
  agendada: { label: "Agendada", variant: "warning" },
  em_andamento: { label: "Em andamento", variant: "default" },
  concluida: { label: "Concluída", variant: "success" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export function ConsultaStatusBadge({ status }: { status: StatusConsulta }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
