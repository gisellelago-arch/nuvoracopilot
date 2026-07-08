"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { solicitarRecuperacaoSenha, type AuthActionState } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const estadoInicial: AuthActionState = {};

export default function EsqueciSenhaPage() {
  const [estado, formAction, pendente] = useActionState(solicitarRecuperacaoSenha, estadoInicial);

  if (estado.sucesso) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <MailCheck className="h-6 w-6" strokeWidth={2} />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold tracking-tight">Verifique seu e-mail</h1>
          <p className="text-sm text-muted-foreground">
            Se houver uma conta cadastrada com esse e-mail, você receberá um link para
            redefinir sua senha em instantes.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Esqueceu sua senha?</h1>
        <p className="text-sm text-muted-foreground">
          Informe seu e-mail e enviaremos um link para você criar uma nova senha.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="voce@clinica.com" required autoFocus />
        </div>

        {estado.erro && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {estado.erro}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={pendente}>
          {pendente ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
        </Link>
      </p>
    </div>
  );
}
