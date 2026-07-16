import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16 text-muted-foreground", className)}>
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
