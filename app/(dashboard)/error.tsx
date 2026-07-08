"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard] Erro não tratado:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Algo deu errado ao carregar esta página</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tente novamente. Se o problema persistir, verifique sua conexão ou contate o suporte.
        </p>
      </div>
      <Button size="sm" onClick={() => reset()}>
        Tentar novamente
      </Button>
    </div>
  );
}
