import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <SearchX className="h-6 w-6" strokeWidth={2} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Página não encontrada</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          O registro que você procura pode ter sido removido ou o link está incorreto.
        </p>
      </div>
      <Button asChild size="sm">
        <Link href="/dashboard">Voltar ao Dashboard</Link>
      </Button>
    </div>
  );
}
