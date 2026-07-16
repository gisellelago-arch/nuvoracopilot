"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
}

export function SearchInput({ placeholder = "Buscar...", paramName = "busca" }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(searchParams.get(paramName) ?? "");
  const [, startTransition] = useTransition();

  function aoDigitar(novoValor: string) {
    setValor(novoValor);
    const params = new URLSearchParams(searchParams.toString());
    if (novoValor) {
      params.set(paramName, novoValor);
    } else {
      params.delete(paramName);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={valor}
        onChange={(e) => aoDigitar(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
