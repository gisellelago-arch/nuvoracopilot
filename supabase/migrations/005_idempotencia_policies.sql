-- ============================================================
-- NuvoraCopilot — Migration 005: idempotência total das policies
-- ============================================================
-- Achado da auditoria: as policies de SELECT e UPDATE criadas na
-- migration 001 não tinham "drop policy if exists" antes do create —
-- rodar a 001 uma segunda vez quebraria com "policy already exists".
-- Esta migration corrige isso, e pode ser rodada quantas vezes for
-- necessário, em qualquer ordem relativa a 001/002/003/004 (todas as
-- operações abaixo são seguras de repetir e não alteram dados).

drop policy if exists "Médico vê apenas seu próprio perfil" on public.medicos;

create policy "Médico vê apenas seu próprio perfil"
  on public.medicos for select
  using (auth.uid() = user_id);

drop policy if exists "Médico edita apenas seu próprio perfil" on public.medicos;

create policy "Médico edita apenas seu próprio perfil"
  on public.medicos for update
  using (auth.uid() = user_id);

-- A policy de INSERT (migration 003) já era idempotente — reafirmada
-- aqui só para manter as 3 operações de medicos num único lugar de
-- referência.
drop policy if exists "Médico cria seu próprio perfil" on public.medicos;

create policy "Médico cria seu próprio perfil"
  on public.medicos for insert
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Diagnóstico: confirme que existem exatamente 3 policies em medicos
-- (select, insert, update) depois de rodar esta migration.
-- ------------------------------------------------------------
-- select policyname, cmd from pg_policies where tablename = 'medicos';
