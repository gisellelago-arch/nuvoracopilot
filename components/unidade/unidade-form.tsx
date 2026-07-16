"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { rotuloTipoUnidade, type Unidade } from "@/types/unidade";
import type { UnidadeActionState } from "@/lib/actions/unidade.actions";

interface UnidadeFormProps {
  action: (estadoAnterior: UnidadeActionState, formData: FormData) => Promise<UnidadeActionState>;
  unidade?: Unidade;
}

const estadoInicial: UnidadeActionState = {};

export function UnidadeForm({ action, unidade }: UnidadeFormProps) {
  const [estado, formAction, pendente] = useActionState(action, estadoInicial);
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da unidade</Label>
        <Input
          id="nome"
          name="nome"
          placeholder="Ex: UBS Vila Nova"
          defaultValue={unidade?.nome}
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo" defaultValue={unidade?.tipo}>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(rotuloTipoUnidade).map(([valor, rotulo]) => (
              <SelectItem key={valor} value={valor}>
                {rotulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {estado.erro && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{estado.erro}</p>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={pendente}>
          {pendente ? "Salvando..." : unidade ? "Salvar alterações" : "Criar unidade"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
