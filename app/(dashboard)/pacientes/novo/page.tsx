import { PageHeader } from "@/components/layout/page-header";
import { PacienteForm } from "@/components/paciente/paciente-form";
import { criarPaciente } from "@/lib/actions/paciente.actions";

export default function NovoPacientePage() {
  return (
    <div>
      <PageHeader title="Novo paciente" description="Cadastre a ficha completa do paciente." />
      <PacienteForm action={criarPaciente} />
    </div>
  );
}
