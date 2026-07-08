# Changelog — NuvoraCopilot

Todas as mudanças relevantes do projeto, em ordem cronológica. O MVP está
**congelado** ao final deste changelog — nenhuma funcionalidade nova até a
próxima etapa de desenvolvimento.

## [MVP Congelado] — Módulo 6 finalizado

### Adicionado
- **Aba Documentos** na ficha do paciente — estrutura preparada (estado
  vazio), sem upload real ainda.
- **Página geral de Exames** (`/exames`) — lista todos os exames de todos
  os pacientes, corrigindo um link quebrado no menu.
- **Página de Configurações** (`/configuracoes`) — perfil do médico
  (somente leitura), atalho para gerenciar unidades, e logout. Corrige o
  segundo link quebrado do menu. Edição completa de perfil fica para uma
  etapa futura.
- **Navegação mobile** — menu hambúrguer com drawer lateral; a sidebar
  fixa não aparecia em telas pequenas antes disso.
- **`loading.tsx`** em 14 rotas que buscam dados — feedback visual
  imediato de carregamento em toda a navegação.
- **Error boundaries** (`error.tsx`) no dashboard e globalmente, além de
  páginas 404 estilizadas (dentro e fora do dashboard).
- **Tratamento de erro de CPF duplicado** ao cadastrar/editar paciente,
  com mensagem amigável em vez de erro bruto do banco.

### Alterado — "Real Data First"
- **Pacientes, Consultas, Exames e Unidades agora usam o Supabase real**,
  não mais dados mock. Médicos já eram reais desde o Módulo 1.
- Todos os dados mock (`lib/mock-data/`, `lib/data/mock/`) foram
  **removidos** do projeto.
- `migration 002` (unidades, pacientes, consultas, audios, exames) agora
  é **obrigatória** para rodar o projeto — antes era só um rascunho de
  arquitetura.
- Aba **Histórico** do paciente agora deriva de consultas + exames reais
  (antes vinha de uma lista mock separada de "anotações").

### Corrigido
- Dois links do menu lateral que levavam a páginas inexistentes
  (`/exames` e `/configuracoes`).
- Sidebar invisível em telas menores que `md` sem alternativa de
  navegação.

---

## Histórico de módulos anteriores

### Camada de API REST (padrão oficial)
- `lib/api/` — `errors.ts`, `response.ts`, `handler.ts`, `auth.ts`.
- 5 rotas em `app/api/` (todas stub, `501 Not Implemented`):
  processar-audio, gerar-soap, processar exame, resumo do paciente, chat
  clínico.
- Middleware ajustado para nunca redirecionar `/api/**` para `/login`
  (responde 401 em JSON).
- Documentado em `docs/ARQUITETURA_API.md`.

### AI Service
- `lib/ai/` — `ai-service.ts`, `types.ts`, `index.ts` (barrel),
  `providers/openai.provider.ts` (stub), `prompts/*.md` (5 prompts
  versionados como texto).
- Chave de API isolada em variável de ambiente do servidor
  (`OPENAI_API_KEY`), nunca exposta ao cliente (`server-only`).
- Documentado em `docs/ARQUITETURA_IA.md`.

### Módulo 5 — Consultas
- Fluxo completo: iniciar atendimento → gravação (placeholder com timer)
  → observações manuais → finalizar → visualização com painéis
  "Transcrição/SOAP/Resumo" marcados como "em breve".
- Bloqueio amigável se não houver paciente ou unidade cadastrada.

### Módulo 4 — Pacientes
- CRUD completo, CPF com validação de dígito verificador real.
- Ficha em abas (Resumo, Consultas, Exames, Histórico — Documentos
  adicionado depois, no Módulo 6).
- Exclusão com confirmação reforçada (dado sensível).

### Módulo 3 — Unidades de Atendimento
- CRUD completo (nome + tipo).

### Módulo 1–2 — Autenticação, Dashboard e Layout
- Login, cadastro (com CRM/UF), recuperação de senha, logout.
- Tabela `medicos` com RLS e auto-provisionamento via trigger no signup.
- Dashboard com ações rápidas (Nova consulta, Buscar paciente, Adicionar
  exame) + listas de recentes.
- Sidebar, Topbar, design system light/clean inspirado em Stripe
  Dashboard.
