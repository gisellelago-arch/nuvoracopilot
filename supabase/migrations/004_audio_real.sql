-- ============================================================
-- NuvoraCopilot — Migration 004: áudio real das consultas
-- ============================================================
-- Adiciona a coluna que guarda o caminho do áudio gravado, e cria o
-- bucket de Storage (privado) onde esses arquivos ficam. Rode este
-- arquivo no SQL Editor do Supabase depois das migrations 001-003.

alter table public.consultas
  add column if not exists audio_url text;

-- ------------------------------------------------------------
-- Bucket de Storage para os áudios das consultas.
-- Privado (public = false): nunca acessível por URL direta — só via
-- signed URL de curta duração, gerada sob demanda (dado de saúde é
-- sensível, não fica exposto publicamente).
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('audios-consultas', 'audios-consultas', false)
on conflict (id) do nothing;

-- Convenção de path: cada arquivo fica em "{user_id}/{consulta_id}.webm"
-- — isso permite usar o próprio path para restringir acesso por RLS,
-- comparando o primeiro segmento do path com o usuário autenticado.
drop policy if exists "Médico gerencia apenas seus próprios áudios" on storage.objects;

create policy "Médico gerencia apenas seus próprios áudios"
  on storage.objects for all
  using (
    bucket_id = 'audios-consultas'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'audios-consultas'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
