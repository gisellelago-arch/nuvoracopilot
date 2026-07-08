-- ============================================================
-- NuvoraCopilot — Migration 001: tabela medicos
-- ============================================================

create table if not exists public.medicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  nome text not null,
  crm text not null,
  crm_uf text not null,
  especialidade text,
  telefone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.medicos is 'Perfil profissional do médico, vinculado 1:1 a auth.users.';

-- Row Level Security: cada médico só acessa o próprio registro.
alter table public.medicos enable row level security;

create policy "Médico vê apenas seu próprio perfil"
  on public.medicos for select
  using (auth.uid() = user_id);

create policy "Médico edita apenas seu próprio perfil"
  on public.medicos for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Auto-provisionamento: ao criar o usuário no Supabase Auth,
-- cria automaticamente a linha correspondente em medicos usando
-- os dados enviados no cadastro (raw_user_meta_data).
-- ------------------------------------------------------------
create or replace function public.handle_new_medico()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.medicos (user_id, nome, crm, crm_uf, especialidade, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', ''),
    coalesce(new.raw_user_meta_data ->> 'crm', ''),
    coalesce(new.raw_user_meta_data ->> 'crm_uf', ''),
    new.raw_user_meta_data ->> 'especialidade',
    new.raw_user_meta_data ->> 'telefone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_medico();

-- ------------------------------------------------------------
-- Mantém updated_at sempre atual
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_medicos_updated_at on public.medicos;

create trigger set_medicos_updated_at
  before update on public.medicos
  for each row execute function public.set_updated_at();
