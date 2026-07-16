-- ============================================================
-- NuvoraCopilot — Migration 003: hardening da autenticação
-- ============================================================
-- Idempotente — segura para rodar múltiplas vezes e mesmo que a
-- migration 001 já tenha sido aplicada. Objetivo: garantir que nada
-- bloqueie o auto-provisionamento do médico no cadastro.

-- ------------------------------------------------------------
-- Política de INSERT em medicos (defesa em profundidade).
-- O trigger já roda como SECURITY DEFINER (bypassa RLS por privilégio
-- de owner), mas garantimos explicitamente que também há uma policy
-- de INSERT coerente, para qualquer camada futura que dependa dela.
-- ------------------------------------------------------------
drop policy if exists "Médico cria seu próprio perfil" on public.medicos;

create policy "Médico cria seu próprio perfil"
  on public.medicos for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Re-cria a função do trigger (idempotente via CREATE OR REPLACE).
-- Igual à migration 001, reafirmada aqui para garantir que o owner e
-- as permissões estão corretos mesmo se a 001 foi rodada por engano
-- com um role diferente.
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
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Garante que o dono da função é postgres (bypassa RLS via SECURITY
-- DEFINER). Se a função foi criada por outro role sem privilégio de
-- bypass, isto corrige.
alter function public.handle_new_medico() owner to postgres;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_medico();

-- ------------------------------------------------------------
-- Diagnóstico: rode esta consulta manualmente no SQL Editor para
-- confirmar que tudo existe corretamente após aplicar esta migration.
-- (comentado — não faz parte da migration em si)
-- ------------------------------------------------------------
-- select trigger_name, event_manipulation, event_object_table
--   from information_schema.triggers
--   where trigger_name = 'on_auth_user_created';
--
-- select proname, prosecdef, proowner::regrole
--   from pg_proc
--   where proname = 'handle_new_medico';
--
-- select policyname, cmd, qual, with_check
--   from pg_policies
--   where tablename = 'medicos';
