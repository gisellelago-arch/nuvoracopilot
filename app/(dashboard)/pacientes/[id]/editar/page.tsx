import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PacienteForm } from "@/components/paciente/paciente-form";
import { atualizarPaciente } from "@/lib/actions/paciente.actions";
import { pacienteRepository } from "@/lib/data";

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await pacienteRepository.buscarPorId(id);

  if (!paciente) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar paciente" description={`Atualize os dados de ${paciente.nome}.`} />
      <PacienteForm action={atualizarPaciente.bind(null, paciente.id)} paciente={paciente} />
    </div>
  );
}
