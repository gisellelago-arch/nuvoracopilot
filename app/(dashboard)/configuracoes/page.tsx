import Link from "next/link";
import { Building2, LogOut, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { medicoRepository } from "@/lib/data";
import { sair } from "@/lib/actions/auth.actions";
import { formatarCRM, formatarTelefone } from "@/lib/utils/format";

function CampoPerfil({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{valor}</p>
    </div>
  );
}

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const medico = user ? await medicoRepository.buscarPorUserId(user.id) : null;

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Configurações" description="Seu perfil e preferências do sistema." />

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <User className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Perfil profissional</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-0">
          <CampoPerfil label="Nome" valor={medico?.nome ?? "—"} />
          <CampoPerfil label="CRM" valor={medico ? formatarCRM(medico.crm, medico.crmUf) : "—"} />
          <CampoPerfil label="Especialidade" valor={medico?.especialidade ?? "Não informada"} />
          <CampoPerfil
            label="Telefone"
            valor={medico?.telefone ? formatarTelefone(medico.telefone) : "Não informado"}
          />
          <CampoPerfil label="E-mail" valor={user?.email ?? "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <CardTitle>Locais de atendimento</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-3 text-sm text-muted-foreground">
            Gerencie as unidades onde você atende (UBS, hospital, consultório).
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/unidades">Gerenciar unidades</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium">Encerrar sessão</p>
            <p className="text-xs text-muted-foreground">Você precisará entrar novamente para acessar o sistema.</p>
          </div>
          <form action={sair}>
            <Button type="submit" variant="outline" className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Edição de perfil, preferências e segurança chegam em uma próxima etapa.
      </p>
    </div>
  );
}
