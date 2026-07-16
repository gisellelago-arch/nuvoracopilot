import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ConsultaEditarForm } from "@/components/consulta/consulta-editar-form";
import { consultaRepository, unidadeRepository } from "@/lib/data";

export default async function EditarConsultaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [consulta, unidades] = await Promise.all([
    consultaRepository.buscarPorId(id),
    unidadeRepository.listar(),
  ]);

  if (!consulta) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Editar consulta"
        description={`Corrija os dados desta consulta de ${consulta.pacienteNome}. Nenhuma outra consulta ou o cadastro do paciente é alterado.`}
      />
      <ConsultaEditarForm consulta={consulta} unidades={unidades} />
    </div>
  );
}
