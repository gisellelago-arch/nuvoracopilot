"use client";

import { useState } from "react";
import { ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ConsultaTranscricao({ transcricao }: { transcricao: string | null }) {
  const [aberta, setAberta] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Transcrição completa</CardTitle>
        </div>
        {transcricao && (
          <Button type="button" size="sm" variant="outline" onClick={() => setAberta((v) => !v)}>
            {aberta ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Recolher transcrição
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Ver transcrição completa
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {!transcricao ? (
          <p className="text-sm text-muted-foreground">Transcrição não disponível.</p>
        ) : aberta ? (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{transcricao}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Transcrição disponível — recolhida por padrão. Clique em &ldquo;Ver transcrição
            completa&rdquo; para exibir.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
