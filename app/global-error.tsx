"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NuvoraCopilot] Erro não tratado:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="space-y-1 px-4">
            <p className="text-sm font-medium text-zinc-900">Algo deu errado</p>
            <p className="max-w-sm text-sm text-zinc-500">
              Ocorreu um erro inesperado. Tente novamente em instantes.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="mt-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
