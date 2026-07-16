import Link from "next/link";
import { CalendarClock, FileText, ScrollText, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConsultaStatusBadge } from "@/components/consulta/consulta-status-badge";
import { consultaRepository } from "@/lib/data";
import { formatarData } from "@/lib/utils/date";

export default async function PacienteConsultasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const consultas = await consultaRepository.listarPorPaciente(id);

  return (
    <Card>
      <CardContent className="p-5">
        {consultas.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nenhuma consulta registrada para este paciente." />
        ) : (
          <div className="divide-y divide-border">
            {consultas.map((consulta) => {
              const hora = new Date(consulta.dataHora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const temSoap = Boolean(consulta.soap);
              const temTranscricao = Boolean(consulta.transcricao);

              return (
                <Link
                  key={consulta.id}
                  href={`/consultas/${consulta.id}`}
                  className="-mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{consulta.motivoConsulta || "Consulta"}</p>
                      <ConsultaStatusBadge status={consulta.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatarData(consulta.dataHora)} às {hora} · {consulta.unidadeNome}
                    </p>
                    {consulta.resumo && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{consulta.resumo}</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className={`flex items-center gap-1 ${temSoap ? "text-primary" : ""}`}>
                        <FileText className="h-3.5 w-3.5" />
                        {temSoap ? "SOAP disponível" : "SOAP ainda não gerado"}
                      </span>
                      <span className={`flex items-center gap-1 ${temTranscricao ? "text-primary" : ""}`}>
                        <ScrollText className="h-3.5 w-3.5" />
                        {temTranscricao ? "Transcrição disponível" : "Transcrição não disponível"}
                      </span>
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                    Abrir consulta
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
