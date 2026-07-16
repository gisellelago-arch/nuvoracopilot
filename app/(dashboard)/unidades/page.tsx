import Link from "next/link";
import { Plus, Building2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { UnidadeRow } from "@/components/unidade/unidade-row";
import { unidadeRepository } from "@/lib/data";

const MENSAGENS_ERRO: Record<string, string> = {
  em_uso:
    "Não é possível excluir esta unidade porque já existem consultas registradas nela. Consultas antigas precisam manter a unidade onde ocorreram.",
  inesperado: "Não foi possível excluir a unidade agora. Tente novamente em instantes.",
};

export default async function UnidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const unidades = await unidadeRepository.listar();
  const mensagemErro = erro ? MENSAGENS_ERRO[erro] : undefined;

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

      {mensagemErro && (
        <div className="mb-4 flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{mensagemErro}</p>
        </div>
      )}

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
