import { PageHeader } from "@/components/layout/page-header";
import { UnidadeForm } from "@/components/unidade/unidade-form";
import { criarUnidade } from "@/lib/actions/unidade.actions";

export default function NovaUnidadePage() {
  return (
    <div>
      <PageHeader title="Nova unidade" description="Cadastre um novo local de atendimento." />
      <UnidadeForm action={criarUnidade} />
    </div>
  );
}
