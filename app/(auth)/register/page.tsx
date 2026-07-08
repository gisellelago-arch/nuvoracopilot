"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cadastrar, type AuthActionState } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const estadoInicial: AuthActionState = {};

export default function RegisterPage() {
  const [estado, formAction, pendente] = useActionState(cadastrar, estadoInicial);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Criar conta</h1>
        <p className="text-sm text-muted-foreground">
          Leva menos de um minuto. Você poderá completar seu perfil depois.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" name="nome" placeholder="Dra. Camila Rodrigues" required autoFocus />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="crm">CRM</Label>
            <Input id="crm" name="crm" placeholder="123456" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crmUf">UF</Label>
            <Input id="crmUf" name="crmUf" placeholder="SP" maxLength={2} required className="uppercase" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="especialidade">
            Especialidade <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Input id="especialidade" name="especialidade" placeholder="Clínica Geral" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="voce@clinica.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" name="senha" type="password" placeholder="Mínimo 8 caracteres" required />
        </div>

        {estado.erro && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {estado.erro}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pendente}>
          {pendente ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
