import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsultaStatusBadge } from "@/components/consulta/consulta-status-badge";
import { GravadorConsulta } from "@/components/consulta/gravador-consulta";
import { ConsultaResumoPlaceholder } from "@/components/consulta/consulta-resumo-placeholder";
import { iniciarAtendimentoAction } from "@/lib/actions/consulta.actions";
import { consultaRepository } from "@/lib/data";
import { formatarDataHora } from "@/lib/utils/date";

export default async function ConsultaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consulta = await consultaRepository.buscarPorId(id);

  if (!consulta) {
    notFound();
  }

  const iniciarComId = iniciarAtendimentoAction.bind(null, consulta.id);

  return (
    <div>
      <PageHeader
        title={consulta.motivoConsulta || "Consulta"}
        description={formatarDataHora(consulta.dataHora)}
        actions={<ConsultaStatusBadge status={consulta.status} />}
      />

      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-6 p-5">
          <Link
            href={`/pacientes/${consulta.pacienteId}`}
            className="flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            {consulta.pacienteNome}
          </Link>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {consulta.unidadeNome}
          </span>
          {consulta.duracaoMinutos && (
            <span className="tabular-data text-sm text-muted-foreground">
              Duração: {consulta.duracaoMinutos} min
            </span>
          )}
        </CardContent>
      </Card>

      {consulta.status === "agendada" && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Esta consulta ainda não foi iniciada.
            </p>
            <form action={iniciarComId}>
              <Button type="submit">Iniciar atendimento</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {consulta.status === "em_andamento" && (
        <GravadorConsulta consultaId={consulta.id} observacoesIniciais={consulta.observacoes ?? ""} />
      )}

      {consulta.status === "concluida" && (
        <div className="space-y-4">
          {consulta.observacoes && (
            <Card>
              <CardContent className="p-5">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">Observações registradas</p>
                <p className="whitespace-pre-wrap text-sm">{consulta.observacoes}</p>
              </CardContent>
            </Card>
          )}
          <ConsultaResumoPlaceholder />
        </div>
      )}

      {consulta.status === "cancelada" && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Esta consulta foi cancelada.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
