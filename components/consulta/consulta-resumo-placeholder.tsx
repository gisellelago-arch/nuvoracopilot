import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function PainelEmBreve({ titulo }: { titulo: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{titulo}</CardTitle>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" /> Em breve
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          O NuvoraCopilot vai gerar {titulo.toLowerCase()} automaticamente a partir do áudio da
          consulta assim que a IA for ativada.
        </p>
      </CardContent>
    </Card>
  );
}

export function ConsultaResumoPlaceholder() {
  return (
    <div className="space-y-4">
      <PainelEmBreve titulo="Transcrição" />
      <PainelEmBreve titulo="SOAP" />
      <PainelEmBreve titulo="Resumo" />
    </div>
  );
}
