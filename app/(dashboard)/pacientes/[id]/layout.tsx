import { notFound } from "next/navigation";
import { pacienteRepository } from "@/lib/data";
import { PacienteHeader } from "@/components/paciente/paciente-header";
import { PacienteTabs } from "@/components/paciente/paciente-tabs";

export default async function PacienteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paciente = await pacienteRepository.buscarPorId(id);

  if (!paciente) {
    notFound();
  }

  return (
    <div>
      <PacienteHeader paciente={paciente} />
      <PacienteTabs pacienteId={paciente.id} />
      <div className="pt-6">{children}</div>
    </div>
  );
}
