"use client";

import { useActionState } from "react";
import { redefinirSenha, type AuthActionState } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const estadoInicial: AuthActionState = {};

export default function RedefinirSenhaPage() {
  const [estado, formAction, pendente] = useActionState(redefinirSenha, estadoInicial);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Criar nova senha</h1>
        <p className="text-sm text-muted-foreground">Escolha uma nova senha para sua conta.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="senha">Nova senha</Label>
          <Input id="senha" name="senha" type="password" placeholder="Mínimo 8 caracteres" required autoFocus />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
          <Input id="confirmarSenha" name="confirmarSenha" type="password" placeholder="Repita a senha" required />
        </div>

        {estado.erro && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {estado.erro}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pendente}>
          {pendente ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );
}
