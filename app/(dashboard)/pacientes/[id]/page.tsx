import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pacienteRepository } from "@/lib/data";
import { formatarData } from "@/lib/utils/date";

function CampoResumo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{valor}</p>
    </div>
  );
}

export default async function PacienteResumoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paciente = await pacienteRepository.buscarPorId(id);

  if (!paciente) {
    notFound();
  }

  const enderecoCompleto = [paciente.endereco, paciente.cidade, paciente.estado]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-0">
          <CampoResumo label="E-mail" valor={paciente.email ?? "Não informado"} />
          <CampoResumo label="Convênio" valor={paciente.convenio ?? "Particular"} />
          <CampoResumo label="Endereço" valor={enderecoCompleto || "Não informado"} />
          <CampoResumo label="Nascimento" valor={formatarData(paciente.dataNascimento)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            {paciente.observacoes || "Nenhuma observação registrada."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
