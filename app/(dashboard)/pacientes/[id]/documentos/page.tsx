import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default async function PacienteDocumentosPage() {
  // Estrutura preparada para a próxima etapa: upload de atestados,
  // receitas antigas, encaminhamentos e laudos externos. Ainda sem
  // tabela própria no banco nem upload real — ver docs/ARQUITETURA_API.md
  // quando essa funcionalidade for priorizada.
  return (
    <Card>
      <CardContent className="p-5">
        <EmptyState
          icon={FileText}
          title="Nenhum documento anexado"
          description="Em breve você poderá anexar atestados, receitas, encaminhamentos e outros documentos do paciente aqui."
          action={
            <Button size="sm" disabled>
              Adicionar documento (em breve)
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
