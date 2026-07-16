-- ============================================================
-- NuvoraCopilot — Migration 007: remover tabela `audios` órfã
-- ============================================================
-- Achado da auditoria (ETAPA 4): a migration 002 criou a tabela
-- `public.audios` (pensada originalmente para permitir múltiplas
-- gravações/tentativas por consulta), mas a implementação real de
-- áudio que acabou entrando no produto (migration 004) tomou um
-- caminho mais simples:
--   • o arquivo de áudio vai para o bucket de Storage
--     "audios-consultas" (não a tabela "audios");
--   • a URL/caminho fica direto na coluna `consultas.audio_url`.
--
-- Resultado: a tabela `public.audios` nunca foi lida nem escrita por
-- nenhum código da aplicação (confirmado por busca em todo o
-- repositório) — ela existe no banco sem função alguma, só criando
-- confusão com o bucket de nome parecido ("audios" vs.
-- "audios-consultas"). Esta migration remove essa tabela órfã.
--
-- Seguro de rodar: a tabela nunca recebe INSERTs pela aplicação, então
-- não há dado real para perder. Se por algum motivo você tiver dados
-- nela (ex: teste manual via SQL Editor) e quiser preservá-los antes de
-- rodar isto, exporte a tabela primeiro.
-- ============================================================

drop trigger if exists set_audios_updated_at on public.audios;
drop policy if exists "Médico gerencia apenas seus áudios" on public.audios;
drop table if exists public.audios;
