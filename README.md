# NuvoraCopilot

Copiloto clínico com IA — reduz o tempo de documentação durante a
consulta. Este é o **MVP congelado**: sistema totalmente navegável, com
dados reais no Supabase, pronto para testes manuais.

> IA, OCR, upload de áudio, OpenAI e n8n **não estão implementados** —
> a arquitetura já está preparada para isso (ver `docs/`), mas nenhuma
> chamada real acontece ainda.

## Pré-requisitos

- Node.js 20 ou superior
- Uma conta gratuita no [Supabase](https://supabase.com)

## Passo a passo para rodar localmente

### 1. Instalar as dependências

```bash
npm install
```

### 2. Criar um projeto no Supabase

Se ainda não tiver um projeto, crie um em https://supabase.com/dashboard
(gratuito). Anote a **Project URL** e a **anon public key** — estão em
`Project Settings → API`.

### 3. Configurar as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

(`OPENAI_API_KEY` pode ficar em branco — não é usada ainda.)

### 4. Aplicar as migrations no Supabase

No painel do Supabase, abra **SQL Editor** e rode, **nesta ordem**, o
conteúdo de cada arquivo:

1. `supabase/migrations/001_medicos.sql`
2. `supabase/migrations/002_schema_completo.sql`

Isso cria todas as tabelas (`medicos`, `unidades`, `pacientes`,
`consultas`, `exames`, `audios`), as políticas de Row Level Security e o
trigger que provisiona automaticamente o perfil do médico no cadastro.

> Sem este passo o sistema não funciona — desde o Módulo 6 não há mais
> fallback de dados mock (filosofia "Real Data First").

### 5. Rodar o projeto

```bash
npm run dev
```

### 6. Abrir no navegador

Acesse **http://localhost:3000**

Você será redirecionado para `/login`. Como é o primeiro acesso, clique
em **"Criar conta"** e cadastre-se (nome, CRM, UF, e-mail, senha).

## Roteiro sugerido de teste manual

1. Criar conta → login automático → Dashboard.
2. **Configurações** → conferir que os dados do cadastro aparecem.
3. **Unidades** → cadastrar uma unidade (ex: "Consultório", tipo
   Consultório particular).
4. **Pacientes** → cadastrar um paciente completo.
5. Na ficha do paciente, navegar pelas abas (Resumo, Consultas, Exames,
   Histórico, Documentos) — todas devem abrir sem erro, com estado vazio
   amigável.
6. **Nova consulta** (pelo dashboard ou pela ficha do paciente) →
   selecionar paciente + unidade → iniciar atendimento.
7. Na tela de atendimento: testar o timer (iniciar/pausar), escrever uma
   observação, salvar, e depois finalizar a consulta.
8. Voltar à ficha do paciente → aba Consultas deve mostrar a consulta
   concluída; aba Histórico deve refletir o evento.
9. Testar "Esqueci minha senha" a partir do login.
10. Testar responsividade: reduzir a largura do navegador (ou abrir no
    celular) e usar o menu hambúrguer.

## Scripts disponíveis

```bash
npm run dev          # ambiente de desenvolvimento
npm run build        # build de produção
npm run start        # roda o build de produção
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

## Estrutura do projeto

```
app/                  # rotas (App Router): (auth), (dashboard), api/
components/
  ui/                 # primitivos shadcn/ui
  {paciente,consulta,exame,unidade,dashboard,layout,shared}/
lib/
  data/               # camada de repositório — interfaces em types.ts,
                       # implementações reais (Supabase) em supabase/
  actions/            # Server Actions (CRUD)
  api/                # helpers das rotas REST (auth, response, errors, handler)
  ai/                 # AI Service (stub) — provider-agnostic, prompts versionados
  validators/         # schemas Zod
  supabase/           # clientes Supabase (browser/server/middleware)
  utils/              # formatação, datas, CPF
supabase/migrations/  # SQL versionado
docs/                 # arquitetura de IA e de API (detalhado)
CHANGELOG.md          # histórico completo de mudanças
```

## Documentação de arquitetura

- `docs/ARQUITETURA_IA.md` — como a IA vai ser integrada (AI Service,
  troca de provedor, prompts).
- `docs/ARQUITETURA_API.md` — padrão das rotas REST, autenticação,
  formato de resposta, códigos de erro.

## Status do MVP (congelado)

- [x] Autenticação (login, cadastro, recuperação de senha)
- [x] Dashboard
- [x] Unidades de atendimento (CRUD)
- [x] Pacientes (CRUD + ficha em abas: Resumo, Consultas, Exames,
      Histórico, Documentos)
- [x] Consultas (iniciar, gravação placeholder, observações, finalizar)
- [x] Dados reais no Supabase (sem mock) para pacientes/consultas/exames/unidades
- [x] Estados vazios, loading e error boundaries em todas as telas
      relevantes
- [ ] IA real (transcrição, SOAP, resumo, OCR de exames) — arquitetura
      pronta, chamadas não implementadas
- [ ] n8n — não iniciado
- [ ] Upload real de áudio/documentos — não iniciado
