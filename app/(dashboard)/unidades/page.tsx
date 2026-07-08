import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { UnidadeRow } from "@/components/unidade/unidade-row";
import { unidadeRepository } from "@/lib/data";

export default async function UnidadesPage() {
  const unidades = await unidadeRepository.listar();

  return (
    <div>
      <PageHeader
        title="Unidades de atendimento"
        description="Os locais onde você atende. Toda consulta pertence a uma unidade."
        actions={
          <Button asChild>
            <Link href="/unidades/nova">
              <Plus className="h-4 w-4" /> Nova unidade
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-5">
          {unidades.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Nenhuma unidade cadastrada"
              description="Cadastre a primeira unidade (ex: UBS, hospital ou consultório) para começar."
              action={
                <Button asChild size="sm">
                  <Link href="/unidades/nova">Cadastrar unidade</Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-border">
              {unidades.map((unidade) => (
                <UnidadeRow key={unidade.id} unidade={unidade} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
