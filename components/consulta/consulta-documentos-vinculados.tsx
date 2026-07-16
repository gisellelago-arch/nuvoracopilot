import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sem tabela própria de documentos no banco ainda (ver aba Documentos do
// paciente). Mantemos o mesmo estado honesto aqui, sem inventar dados.
export function ConsultaDocumentosVinculados() {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <CardTitle>Documentos vinculados</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          Nenhum documento anexado. Em breve você poderá anexar atestados, receitas e
          encaminhamentos vinculados a esta consulta.
        </p>
      </CardContent>
    </Card>
  );
}
