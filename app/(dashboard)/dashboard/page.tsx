import { Mic, Search, Camera } from "lucide-react";
import { QuickAction } from "@/components/dashboard/quick-action";
import { ConsultasRecentes } from "@/components/dashboard/consultas-recentes";
import { PacientesRecentes } from "@/components/dashboard/pacientes-recentes";
import { pacienteRepository, consultaRepository } from "@/lib/data";

export default async function DashboardPage() {
  const [pacientes, proximasConsultas] = await Promise.all([
    pacienteRepository.listar(),
    consultaRepository.listarProximas(4),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Olá, seja bem-vindo(a)</h1>
        <p className="text-sm text-muted-foreground">O que você precisa fazer agora?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickAction
          href="/consultas/nova"
          label="Nova consulta"
          description="Inicie o atendimento e grave a consulta"
          icon={Mic}
        />
        <QuickAction
          href="/pacientes"
          label="Buscar paciente"
          description="Acesse a ficha e o histórico completo"
          icon={Search}
        />
        <QuickAction
          href="/exames"
          label="Adicionar exame"
          description="Fotografe ou envie um exame em papel"
          icon={Camera}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ConsultasRecentes consultas={proximasConsultas} />
        <PacientesRecentes pacientes={pacientes.slice(0, 5)} />
      </div>
    </div>
  );
}
