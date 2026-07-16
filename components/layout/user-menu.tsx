"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { sair } from "@/lib/actions/auth.actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { obterIniciais, formatarCRM } from "@/lib/utils/format";

interface UserMenuProps {
  nome: string;
  crm: string;
  crmUf: string;
}

export function UserMenu({ nome, crm, crmUf }: UserMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2.5 rounded-md p-1.5 pr-2 transition-colors hover:bg-muted">
          <Avatar className="h-7 w-7">
            <AvatarFallback>{obterIniciais(nome)}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight">{nome}</p>
            <p className="tabular-data text-xs leading-tight text-muted-foreground">
              {formatarCRM(crm, crmUf)}
            </p>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 rounded-md border border-border bg-popover p-1 shadow-popover animate-fade-in"
        >
          <DropdownMenu.Item asChild>
            <Link
              href="/configuracoes"
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-sm outline-none hover:bg-muted"
            >
              <Settings className="h-4 w-4" /> Configurações
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <form action={sair}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-left text-sm text-destructive outline-none hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
