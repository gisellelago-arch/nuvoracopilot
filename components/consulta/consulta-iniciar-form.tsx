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
import { iniciarConsultaAgora, type ConsultaActionState } from "@/lib/actions/consulta.actions";
import { formatarCPF } from "@/lib/utils/format";
import type { Paciente } from "@/types/paciente";
import type { Unidade } from "@/types/unidade";
import { rotuloTipoUnidade } from "@/types/unidade";

interface ConsultaIniciarFormProps {
  pacientes: Paciente[];
  unidades: Unidade[];
  pacienteIdPreSelecionado?: string;
}

const estadoInicial: ConsultaActionState = {};

export function ConsultaIniciarForm({
  pacientes,
  unidades,
  pacienteIdPreSelecionado,
}: ConsultaIniciarFormProps) {
  const [estado, formAction, pendente] = useActionState(iniciarConsultaAgora, estadoInicial);
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pacienteId">Paciente</Label>
        <Select name="pacienteId" defaultValue={pacienteIdPreSelecionado}>
          <SelectTrigger id="pacienteId">
            <SelectValue placeholder="Selecione o paciente" />
          </SelectTrigger>
          <SelectContent>
            {pacientes.map((paciente) => (
              <SelectItem key={paciente.id} value={paciente.id}>
                {paciente.nome} — {formatarCPF(paciente.cpf)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unidadeId">Unidade de atendimento</Label>
        <Select name="unidadeId">
          <SelectTrigger id="unidadeId">
            <SelectValue placeholder="Selecione a unidade" />
          </SelectTrigger>
          <SelectContent>
            {unidades.map((unidade) => (
              <SelectItem key={unidade.id} value={unidade.id}>
                {unidade.nome} · {rotuloTipoUnidade[unidade.tipo]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivoConsulta">
          Motivo da consulta <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="motivoConsulta" name="motivoConsulta" placeholder="Ex: Retorno, dor abdominal..." />
      </div>

      {estado.erro && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{estado.erro}</p>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={pendente}>
          {pendente ? "Iniciando..." : "Iniciar atendimento"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
