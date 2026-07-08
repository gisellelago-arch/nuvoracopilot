import Link from "next/link";
import { Users, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultaIniciarForm } from "@/components/consulta/consulta-iniciar-form";
import { pacienteRepository, unidadeRepository } from "@/lib/data";

export default async function NovaConsultaPage({
  searchParams,
}: {
  searchParams: Promise<{ pacienteId?: string }>;
}) {
  const { pacienteId } = await searchParams;
  const [pacientes, unidades] = await Promise.all([
    pacienteRepository.listar(),
    unidadeRepository.listar(),
  ]);

  if (pacientes.length === 0) {
    return (
      <div>
        <PageHeader title="Nova consulta" description="Inicie o atendimento de um paciente." />
        <EmptyState
          icon={Users}
          title="Cadastre um paciente antes de iniciar uma consulta"
          description="Você ainda não tem nenhum paciente cadastrado."
          action={
            <Button asChild size="sm">
              <Link href="/pacientes/novo">Cadastrar paciente</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (unidades.length === 0) {
    return (
      <div>
        <PageHeader title="Nova consulta" description="Inicie o atendimento de um paciente." />
        <EmptyState
          icon={Building2}
          title="Cadastre uma unidade antes de iniciar uma consulta"
          description="Toda consulta precisa pertencer a uma unidade de atendimento (ex: UBS, hospital ou consultório)."
          action={
            <Button asChild size="sm">
              <Link href="/unidades/nova">Cadastrar unidade</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Nova consulta" description="Selecione o paciente e a unidade para iniciar o atendimento." />
      <ConsultaIniciarForm pacientes={pacientes} unidades={unidades} pacienteIdPreSelecionado={pacienteId} />
    </div>
  );
}
