-- ============================================================
-- NuvoraCopilot — Migration 002: schema oficial completo
-- ============================================================
-- A partir do Módulo 6, esta migration é OBRIGATÓRIA — o projeto segue
-- a filosofia "Real Data First": pacientes, consultas, exames e
-- unidades usam exclusivamente o Supabase real, sem fallback mock.
-- Aplique este arquivo (além de 001_medicos.sql) antes de rodar o
-- projeto. Ver README.md para o passo a passo completo.
--
-- Convenções adotadas:
--   • Toda tabela usa UUID como chave primária.
--   • Toda tabela tem created_at / updated_at.
--   • Isolamento por médico via coluna `user_id` direto (referencia
--     auth.users), em vez de join com `medicos` — mais simples e mais
--     rápido nas policies de RLS. Cada médico só vê os próprios dados.
-- ============================================================

-- ------------------------------------------------------------
-- UNIDADES DE ATENDIMENTO
-- ------------------------------------------------------------
create table if not exists public.unidades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  tipo text not null check (tipo in ('ubs', 'hospital', 'clinica', 'consultorio_particular', 'outro')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.unidades enable row level security;

create policy "Médico gerencia apenas suas unidades"
  on public.unidades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- PACIENTES
-- Paciente pertence ao médico, NÃO a uma unidade — o histórico é único
-- independentemente de onde o paciente foi atendido.
-- ------------------------------------------------------------
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  cpf text not null,
  data_nascimento date not null,
  sexo text not null check (sexo in ('masculino', 'feminino')),
  telefone text,
  email text,
  endereco text,
  cidade text,
  estado text,
  convenio text,
  alergias text[] default '{}',
  comorbidades text[] default '{}',
  observacoes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create unique index if not exists pacientes_user_cpf_idx on public.pacientes (user_id, cpf);

alter table public.pacientes enable row level security;

create policy "Médico gerencia apenas seus pacientes"
  on public.pacientes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- CONSULTAS
-- Toda consulta pertence obrigatoriamente a uma unidade.
-- ------------------------------------------------------------
create table if not exists public.consultas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  paciente_id uuid references public.pacientes(id) on delete cascade not null,
  unidade_id uuid references public.unidades(id) on delete restrict not null,
  status text not null default 'agendada'
    check (status in ('agendada', 'em_andamento', 'concluida', 'cancelada')),
  motivo_consulta text,
  data_hora timestamptz not null,
  duracao_minutos integer,
  transcricao text,
  soap jsonb,
  resumo text,
  observacoes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists consultas_paciente_idx on public.consultas (paciente_id);
create index if not exists consultas_unidade_idx on public.consultas (unidade_id);

alter table public.consultas enable row level security;

create policy "Médico gerencia apenas suas consultas"
  on public.consultas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- ÁUDIOS
-- Tabela separada de `consultas` para suportar múltiplas gravações/
-- tentativas por consulta (ex: retomar gravação, re-upload) sem
-- sobrescrever histórico. A consulta referencia o áudio "ativo" via
-- lógica de aplicação; aqui fica o registro bruto de cada arquivo.
-- ------------------------------------------------------------
create table if not exists public.audios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  consulta_id uuid references public.consultas(id) on delete cascade not null,
  arquivo_url text not null,
  duracao_segundos integer,
  status text not null default 'processando'
    check (status in ('processando', 'transcrito', 'erro')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists audios_consulta_idx on public.audios (consulta_id);

alter table public.audios enable row level security;

create policy "Médico gerencia apenas seus áudios"
  on public.audios for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- EXAMES
-- Foco em exames fotografados; paciente_id obrigatório, consulta_id
-- opcional (exame pode ser enviado fora do contexto de uma consulta).
-- ------------------------------------------------------------
create table if not exists public.exames (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  paciente_id uuid references public.pacientes(id) on delete cascade not null,
  consulta_id uuid references public.consultas(id) on delete set null,
  tipo_exame text,
  origem text not null check (origem in ('foto', 'pdf', 'audio')),
  status text not null default 'processando'
    check (status in ('processando', 'concluido', 'erro')),
  arquivo_url text not null,
  data_exame date,
  observacoes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists exames_paciente_idx on public.exames (paciente_id);

alter table public.exames enable row level security;

create policy "Médico gerencia apenas os exames de seus pacientes"
  on public.exames for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- updated_at automático para todas as tabelas acima
-- (reaproveita a função set_updated_at() criada na migration 001)
-- ------------------------------------------------------------
create trigger set_unidades_updated_at before update on public.unidades
  for each row execute function public.set_updated_at();

create trigger set_pacientes_updated_at before update on public.pacientes
  for each row execute function public.set_updated_at();

create trigger set_consultas_updated_at before update on public.consultas
  for each row execute function public.set_updated_at();

create trigger set_audios_updated_at before update on public.audios
  for each row execute function public.set_updated_at();

create trigger set_exames_updated_at before update on public.exames
  for each row execute function public.set_updated_at();
