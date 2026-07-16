"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Paciente } from "@/types/paciente";
import type { PacienteActionState } from "@/lib/actions/paciente.actions";

interface PacienteFormProps {
  action: (estadoAnterior: PacienteActionState, formData: FormData) => Promise<PacienteActionState>;
  paciente?: Paciente;
}

const estadoInicial: PacienteActionState = {};

export function PacienteForm({ action, paciente }: PacienteFormProps) {
  const [estado, formAction, pendente] = useActionState(action, estadoInicial);
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Dados pessoais</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" name="nome" defaultValue={paciente?.nome} required autoFocus />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" name="cpf" placeholder="000.000.000-00" defaultValue={paciente?.cpf} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataNascimento">Data de nascimento</Label>
            <Input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              defaultValue={paciente?.dataNascimento}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo</Label>
            <Select name="sexo" defaultValue={paciente?.sexo}>
              <SelectTrigger id="sexo">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" name="telefone" placeholder="(11) 90000-0000" defaultValue={paciente?.telefone} required />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">
              E-mail <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input id="email" name="email" type="email" defaultValue={paciente?.email ?? ""} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Endereço</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-3">
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" name="endereco" defaultValue={paciente?.endereco ?? ""} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" name="cidade" defaultValue={paciente?.cidade ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">UF</Label>
            <Input id="estado" name="estado" maxLength={2} className="uppercase" defaultValue={paciente?.estado ?? ""} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Informações clínicas</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="convenio">
              Convênio <span className="text-muted-foreground">(opcional — deixe em branco se particular)</span>
            </Label>
            <Input id="convenio" name="convenio" defaultValue={paciente?.convenio ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alergias">
              Alergias <span className="text-muted-foreground">(separadas por vírgula)</span>
            </Label>
            <Input
              id="alergias"
              name="alergias"
              placeholder="Ex: Dipirona, Látex"
              defaultValue={paciente?.alergias.join(", ") ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comorbidades">
              Comorbidades <span className="text-muted-foreground">(separadas por vírgula)</span>
            </Label>
            <Input
              id="comorbidades"
              name="comorbidades"
              placeholder="Ex: Hipertensão, Diabetes tipo 2"
              defaultValue={paciente?.comorbidades.join(", ") ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">
              Observações <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={paciente?.observacoes ?? ""} />
          </div>
        </div>
      </section>

      {estado.erro && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{estado.erro}</p>
      )}

      <div className="flex gap-2 border-t border-border pt-5">
        <Button type="submit" disabled={pendente}>
          {pendente ? "Salvando..." : paciente ? "Salvar alterações" : "Cadastrar paciente"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
