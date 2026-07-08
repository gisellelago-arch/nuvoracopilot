import Link from "next/link";
import { Suspense } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { PacienteRow } from "@/components/paciente/paciente-row";
import { pacienteRepository } from "@/lib/data";

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ busca?: string }>;
}) {
  const { busca } = await searchParams;
  const pacientes = await pacienteRepository.listar(busca);

  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Todos os pacientes cadastrados, independente da unidade de atendimento."
        actions={
          <Button asChild>
            <Link href="/pacientes/novo">
              <Plus className="h-4 w-4" /> Novo paciente
            </Link>
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <Suspense fallback={<div className="h-9" />}>
          <SearchInput placeholder="Buscar por nome ou CPF..." paramName="busca" />
        </Suspense>
      </div>

      <Card>
        <CardContent className="p-5">
          {pacientes.length === 0 ? (
            <EmptyState
              icon={Users}
              title={busca ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
              description={busca ? "Tente buscar por outro nome ou CPF." : "Cadastre o primeiro paciente para começar."}
              action={
                !busca && (
                  <Button asChild size="sm">
                    <Link href="/pacientes/novo">Cadastrar paciente</Link>
                  </Button>
                )
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {pacientes.map((paciente) => (
                <PacienteRow key={paciente.id} paciente={paciente} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
