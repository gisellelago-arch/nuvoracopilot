import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Painel de marca — visível apenas em telas maiores */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="h-5 w-5" strokeWidth={2} />
          NuvoraCopilot
        </div>

        <div className="max-w-md space-y-4">
          <p className="text-2xl font-medium leading-snug">
            Menos tempo documentando. Mais tempo com o paciente.
          </p>
          <p className="text-sm text-primary-foreground/70">
            O NuvoraCopilot organiza transcrições, evoluções e exames automaticamente —
            a decisão clínica continua sempre com você.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} NuvoraCopilot. Todos os direitos reservados.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
