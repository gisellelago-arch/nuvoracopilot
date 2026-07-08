# Arquitetura de API — NuvoraCopilot

Este documento descreve o padrão oficial de rotas de API REST do
NuvoraCopilot. **Todas as rotas listadas aqui são stubs** — respondem
`501 Not Implemented` até a integração real de IA ser construída.

## Quando usar API REST vs. Server Action

O projeto usa **dois mecanismos de backend**, cada um com um papel claro:

| Mecanismo | Quando usar | Exemplos |
|---|---|---|
| **Server Actions** (`lib/actions/`) | CRUD simples de dados, consumido só pelo próprio frontend web | Criar/editar/excluir paciente, unidade, consulta |
| **API REST** (`app/api/`) | Qualquer operação de processamento (especialmente IA), pensada para ser consumida por múltiplos clientes (web, mobile, integrações futuras) | Processar áudio, gerar SOAP, processar exame, chat clínico |

Server Actions continuam sendo o padrão para tudo que é cadastro/edição —
não há motivo para transformar isso em API REST. A API REST existe
especificamente para separar a camada de processamento (IA) do frontend.

## Fluxo de toda rota

```
Frontend
   ↓ fetch("/api/...")
Rota de API (app/api/**/route.ts)
   ↓ autentica (lib/api/auth.ts)
   ↓ valida posse do recurso
AI Service (lib/ai)
   ↓
Provedor de IA (hoje: OpenAI)
   ↓
Resposta padronizada (lib/api/response.ts)
   ↓
Frontend
```

## Helpers padrão (`lib/api/`)

```
lib/api/
├── errors.ts     # ApiError e subclasses (Unauthorized, NotFound, Validation, NotImplemented...)
├── response.ts   # apiSuccess() / apiErrorResponse() — formato único de resposta
├── handler.ts    # apiHandler() — wrapper que toda rota usa
└── auth.ts       # obterMedicoAutenticado() — autentica e retorna o médico
```

### Esqueleto de uma rota

```ts
import type { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/handler";
import { obterMedicoAutenticado } from "@/lib/api/auth";
import { NotFoundError } from "@/lib/api/errors";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const { medico } = await obterMedicoAutenticado();
    const { id } = await params;

    // ...buscar o recurso, verificar posse, chamar aiService...

    return { ok: true }; // vira { success: true, data: { ok: true } }
  });
}
```

Nenhuma rota formata JSON manualmente ou verifica sessão por conta
própria — `apiHandler` e `obterMedicoAutenticado` fazem isso de forma
consistente em todas elas.

## Formato de resposta (padrão único)

**Sucesso:**
```json
{
  "success": true,
  "data": { "...": "..." },
  "metadata": { "modeloUtilizado": "gpt-4o" }
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Consulta não encontrada.",
    "details": null
  }
}
```

`metadata` é sempre opcional — usado para informações auxiliares (ex:
qual modelo de IA processou, tempo de processamento), nunca para o dado
principal da resposta.

## Códigos de erro padronizados

| Classe | HTTP | code |
|---|---|---|
| `UnauthorizedError` | 401 | `UNAUTHORIZED` |
| `ForbiddenError` | 403 | `FORBIDDEN` |
| `NotFoundError` | 404 | `NOT_FOUND` |
| `ValidationError` | 422 | `VALIDATION_ERROR` |
| `NotImplementedError` | 501 | `NOT_IMPLEMENTED` |
| `InternalServerError` (fallback) | 500 | `INTERNAL_ERROR` |

Qualquer erro não previsto (não é uma `ApiError`) é automaticamente
capturado pelo `apiHandler` e vira um `InternalServerError` genérico — o
cliente nunca recebe stack trace ou detalhes internos; o erro real só
aparece no log do servidor.

## Autenticação

- Hoje: sessão via cookie, lida pelo `@supabase/ssr` (mesmo mecanismo do
  resto do app). `obterMedicoAutenticado()` lê essa sessão no servidor e
  já retorna o perfil de médico correspondente, ou lança `401`.
- O middleware (`lib/supabase/middleware.ts`) **não redireciona** rotas
  `/api/**` para `/login` — uma chamada de API sem sessão recebe um `401`
  em JSON, nunca uma página HTML. Isso é essencial para clientes que não
  são o navegador (apps mobile, integrações).
- Futuro (mobile nativo): `obterMedicoAutenticado()` é o único lugar que
  precisará aprender a também aceitar um header `Authorization: Bearer`
  — nenhuma rota individual muda.

## Verificação de posse do recurso

RLS no banco já impede um médico de *ler* dados de outro médico. Mas as
rotas de IA devem, além disso, **verificar explicitamente** que o
recurso (consulta, exame, paciente) pertence ao médico autenticado antes
de chamar um provedor de IA — porque uma chamada de IA custa dinheiro
real, e um bug de lógica não deveria virar uma chamada paga sobre o
recurso errado. Essa verificação está marcada como `TODO` em cada rota
stub, para ser implementada junto da integração real (quando os
repositórios estiverem de fato conectados ao Supabase e multi-tenant).

## Rotas existentes (todas stub — 501 Not Implemented)

| Rota | Método | Propósito futuro |
|---|---|---|
| `/api/consultas/:id/processar-audio` | POST | Transcrever o áudio da consulta |
| `/api/consultas/:id/gerar-soap` | POST | Gerar a evolução SOAP a partir da transcrição |
| `/api/exames/:id/processar` | POST | Extrair dados estruturados de um exame |
| `/api/pacientes/:id/resumo` | POST | Resumo inteligente do histórico do paciente |
| `/api/ia/chat` | POST | Chat clínico livre (streaming, futuro) |

## Caso especial: chat com streaming

`/api/ia/chat` não vai seguir o formato `{ success, data }` quando
implementado — um chat precisa de resposta em streaming (Server-Sent
Events), não uma resposta JSON única. Quando essa rota for implementada
de verdade, ela retorna um `Response` com `Content-Type: text/event-stream`
diretamente, sem passar por `apiHandler`/`apiSuccess`. Isso já está
documentado no próprio arquivo da rota.

## Limitação conhecida: operações longas

Transcrição de áudio e geração de SOAP podem ultrapassar o tempo limite
de execução de uma função serverless (a Vercel limita a duração de
funções, variando por plano). Isso não é um problema hoje (as rotas são
stubs), mas o módulo de IA real deve considerar processamento assíncrono
(fila + webhook de callback, no estilo do n8n já previsto na arquitetura
original) em vez de esperar a resposta da IA de forma síncrona dentro da
requisição HTTP.
