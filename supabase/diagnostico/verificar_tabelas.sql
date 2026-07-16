-- Rode isto no SQL Editor do Supabase para confirmar o estado do banco.
-- É só leitura, não altera nada.

-- 1. Quais tabelas existem
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- 2. O trigger de cadastro existe?
select trigger_name, event_manipulation, event_object_table
from information_schema.triggers
where trigger_name = 'on_auth_user_created';

-- 3. Confirmação de e-mail está exigida? (verifique manualmente em
--    Authentication > Providers > Email > "Confirm email" no painel,
--    esta query não acessa essa configuração)

-- 4. Quantos usuários existem em auth.users vs. medicos
--    (ajuda a ver se algum cadastro ficou "órfão")
select
  (select count(*) from auth.users) as total_usuarios_auth,
  (select count(*) from public.medicos) as total_medicos;
