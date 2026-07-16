import { Volume2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConsultaAudio({ audioUrlAssinada }: { audioUrlAssinada: string | null }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <CardTitle>Áudio da consulta</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {audioUrlAssinada ? (
          <audio controls preload="none" className="w-full" src={audioUrlAssinada}>
            Seu navegador não suporta reprodução de áudio.
          </audio>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            Áudio não disponível.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
