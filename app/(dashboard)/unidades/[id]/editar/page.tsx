import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UnidadeForm } from "@/components/unidade/unidade-form";
import { atualizarUnidade } from "@/lib/actions/unidade.actions";
import { unidadeRepository } from "@/lib/data";

export default async function EditarUnidadePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unidade = await unidadeRepository.buscarPorId(id);

  if (!unidade) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Editar unidade" description={`Atualize os dados de "${unidade.nome}".`} />
      <UnidadeForm action={atualizarUnidade.bind(null, unidade.id)} unidade={unidade} />
    </div>
  );
}
