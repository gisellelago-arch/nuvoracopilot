import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickActionProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export function QuickAction({ href, label, description, icon: Icon }: QuickActionProps) {
  return (
    <Link href={href}>
      <Card className="group flex h-full flex-col gap-3 p-5 transition-colors hover:border-primary/40 hover:bg-accent/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </Card>
    </Link>
  );
}
