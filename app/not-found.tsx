import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <SearchX className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="space-y-1 px-4">
        <p className="text-sm font-medium">Página não encontrada</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          O endereço acessado não existe.
        </p>
      </div>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Voltar ao início
      </Link>
    </div>
  );
}
