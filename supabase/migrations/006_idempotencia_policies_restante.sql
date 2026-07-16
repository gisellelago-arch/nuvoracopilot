-- ============================================================
-- NuvoraCopilot — Migration 006: idempotência das policies restantes
-- ============================================================
-- Achado da auditoria (ETAPA 4): a migration 005 tornou idempotentes
-- as policies de `medicos`, mas as policies de `unidades`, `pacientes`,
-- `consultas`, `audios` e `exames` (criadas na migration 002) ainda não
-- tinham "drop policy if exists" antes do create — reaplicar a 002 em
-- um banco que já rodou essa migration falharia com
-- "policy already exists" nessas cinco tabelas.
--
-- Esta migration corrige isso, seguindo o mesmo padrão da 005. Segura
-- de rodar quantas vezes for necessário; não altera dados nem o
-- comportamento das policies, só garante que recriá-las não quebra.
-- ============================================================

drop policy if exists "Médico gerencia apenas suas unidades" on public.unidades;

create policy "Médico gerencia apenas suas unidades"
  on public.unidades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Médico gerencia apenas seus pacientes" on public.pacientes;

create policy "Médico gerencia apenas seus pacientes"
  on public.pacientes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Médico gerencia apenas suas consultas" on public.consultas;

create policy "Médico gerencia apenas suas consultas"
  on public.consultas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Médico gerencia apenas seus áudios" on public.audios;

create policy "Médico gerencia apenas seus áudios"
  on public.audios for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Médico gerencia apenas os exames de seus pacientes" on public.exames;

create policy "Médico gerencia apenas os exames de seus pacientes"
  on public.exames for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Diagnóstico: confirme que unidades, pacientes, consultas, audios e
-- exames têm exatamente 1 policy cada (comando "for all") depois de
-- rodar esta migration.
-- ------------------------------------------------------------
-- select tablename, policyname, cmd from pg_policies
--   where tablename in ('unidades', 'pacientes', 'consultas', 'audios', 'exames');
