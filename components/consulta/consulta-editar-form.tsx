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
import { rotuloTipoUnidade } from "@/types/unidade";
import type { Unidade } from "@/types/unidade";
import type { Consulta } from "@/types/consulta";
import { editarConsultaAction, type ConsultaEditarActionState } from "@/lib/actions/consulta.actions";

interface ConsultaEditarFormProps {
  consulta: Consulta;
  unidades: Unidade[];
}

const estadoInicial: ConsultaEditarActionState = {};

function paraCampoData(dataHora: string) {
  const data = new Date(dataHora);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    data: `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`,
    hora: `${pad(data.getHours())}:${pad(data.getMinutes())}`,
  };
}

export function ConsultaEditarForm({ consulta, unidades }: ConsultaEditarFormProps) {
  const acaoComId = editarConsultaAction.bind(null, consulta.id);
  const [estado, formAction, pendente] = useActionState(acaoComId, estadoInicial);
  const router = useRouter();
  const { data, hora } = paraCampoData(consulta.dataHora);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Dados da consulta</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="motivoConsulta">Tipo da consulta</Label>
            <Input
              id="motivoConsulta"
              name="motivoConsulta"
              defaultValue={consulta.motivoConsulta}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input id="data" name="data" type="date" defaultValue={data} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora">Horário</Label>
            <Input id="hora" name="hora" type="time" defaultValue={hora} required />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="unidadeId">Unidade de atendimento</Label>
            <Select name="unidadeId" defaultValue={consulta.unidadeId}>
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
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Resumo clínico</h2>
        <div className="space-y-2">
          <Label htmlFor="resumo">
            Resumo <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Textarea id="resumo" name="resumo" rows={3} defaultValue={consulta.resumo ?? ""} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Evolução SOAP</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subjetivo">Subjetivo</Label>
            <Textarea id="subjetivo" name="subjetivo" rows={3} defaultValue={consulta.soap?.subjetivo ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Textarea id="objetivo" name="objetivo" rows={3} defaultValue={consulta.soap?.objetivo ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avaliacao">Avaliação</Label>
            <Textarea id="avaliacao" name="avaliacao" rows={3} defaultValue={consulta.soap?.avaliacao ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plano">Plano</Label>
            <Textarea id="plano" name="plano" rows={3} defaultValue={consulta.soap?.plano ?? ""} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Observações</h2>
        <div className="space-y-2">
          <Label htmlFor="observacoes">
            Observações <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <Textarea id="observacoes" name="observacoes" rows={3} defaultValue={consulta.observacoes ?? ""} />
        </div>
      </section>

      {estado.erro && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{estado.erro}</p>
      )}

      <div className="flex gap-2 border-t border-border pt-5">
        <Button type="submit" disabled={pendente}>
          {pendente ? "Salvando..." : "Salvar alterações"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
