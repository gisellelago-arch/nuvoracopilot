"use client";

import { useActionState } from "react";
import Link from "next/link";
import { entrar, type AuthActionState } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const estadoInicial: AuthActionState = {};

export default function LoginPage() {
  const [estado, formAction, pendente] = useActionState(entrar, estadoInicial);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Acesse sua conta para continuar suas consultas.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="voce@clinica.com" required autoFocus />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link href="/esqueci-senha" className="text-xs text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <Input id="senha" name="senha" type="password" placeholder="••••••••" required />
        </div>

        {estado.erro && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {estado.erro}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pendente}>
          {pendente ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem uma conta?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
