# Arquitetura de IA — NuvoraCopilot

Este documento descreve como a inteligência artificial é integrada ao
sistema. **Atualização (Etapa 4):** transcrição, SOAP e resumo já fazem
chamadas reais à OpenAI — ver "Estado atual" mais abaixo para o que
ainda é stub.

## Modelo de negócio

A IA é um **serviço interno do NuvoraCopilot**, não do médico:

- O médico **não** tem conta na OpenAI (ou em qualquer outro provedor de IA).
- Só o **NuvoraCopilot** tem a conta e a API Key do provedor.
- A chave fica **exclusivamente em variável de ambiente do servidor**
  (`OPENAI_API_KEY`, sem prefixo `NEXT_PUBLIC_`) — nunca chega ao navegador.
- O custo e o gerenciamento da conta de IA são responsabilidade do
  NuvoraCopilot, não de cada médico individualmente.

## A regra de ouro

> Nenhum componente, página ou Server Action chama um provedor de IA
> diretamente. Toda comunicação passa pelo **AI Service**
> (`lib/ai/index.ts`).

Isso é análogo ao padrão de repositório já usado para dados (`lib/data/`):
o resto do sistema conhece uma **interface**, nunca a implementação
concreta por trás dela.

## Estrutura de pastas

```
lib/ai/
├── types.ts                       # Interface AIProvider (o contrato)
├── ai-service.ts                  # Implementação de aiService (seleciona o provider ativo)
├── index.ts                       # Barrel — único ponto de import externo
├── prompts/                       # Prompts versionados como texto puro (não código)
│   ├── system.md                  # Persona e regras gerais do copiloto
│   ├── soap.md                    # Tarefa: gerar SOAP
│   ├── exames.md                  # Tarefa: extrair dados de exame
│   ├── historico.md               # Tarefa: resumir histórico do paciente
│   └── resumo-consulta.md         # Tarefa: gerar resumo da consulta
└── providers/
    └── openai.provider.ts         # Implementação OpenAI (real desde a Etapa 4)
```

Manter os prompts como arquivos `.md` separados do código (em vez de
strings dentro do TypeScript) permite ajustar o comportamento de cada
tarefa de IA — e até fazer isso virar um processo de revisão/versionamento
próprio no futuro — sem precisar mexer em lógica de programação.

## O contrato (`AIProvider`)

Qualquer provedor de IA implementa quatro operações, todas pensadas em
torno do que o produto precisa — nunca em torno da API de um provedor
específico:

| Método | Uso |
|---|---|
| `transcreverAudio(audioUrl)` | Transcreve o áudio de uma consulta |
| `gerarSOAP(transcricao)` | Gera a evolução em formato SOAP |
| `gerarResumo(transcricaoOuSoap)` | Gera um resumo curto e legível |
| `extrairDadosExame(arquivoUrl, origem)` | Extrai dados estruturados de um exame (foto/PDF/áudio) |

Ver `lib/ai/types.ts` para as assinaturas completas.

## Como o resto do sistema usa isso

```ts
import { aiService } from "@/lib/ai";

const { texto } = await aiService.transcreverAudio(audioUrl);
const soap = await aiService.gerarSOAP(texto);
const resumo = await aiService.gerarResumo(texto);
```

Isso já acontece de verdade em `app/api/consultas/[id]/processar-audio/route.ts`
(transcrição) e `app/api/consultas/[id]/gerar-soap/route.ts` (SOAP + resumo,
em paralelo). Nenhum desses lugares precisa saber que por trás existe a
OpenAI, o Whisper, o GPT ou qualquer outra coisa.

## Como trocar de provedor no futuro

Trocar OpenAI por Anthropic, Gemini ou qualquer outro provedor é uma
mudança **isolada em dois passos**, sem tocar no restante do projeto:

1. Criar `lib/ai/providers/anthropic.provider.ts` (ou o nome do provedor)
   implementando a interface `AIProvider`.
2. Em `lib/ai/index.ts`, trocar a linha:
   ```ts
   export const aiService: AIProvider = openAIProvider;
   ```
   para:
   ```ts
   export const aiService: AIProvider = anthropicProvider;
   ```

Nenhuma página, componente, Server Action ou schema de banco muda.

## Proteção contra vazamento no cliente

Todos os arquivos de `lib/ai/` começam com `import "server-only"`. Esse
pacote **quebra o build imediatamente** se qualquer um desses arquivos for
importado, direta ou indiretamente, por um Client Component (`"use client"`).
Isso torna a regra "nenhuma página conhece a API de IA" impossível de violar
por acidente, não apenas uma convenção de código.

## Estado atual (Etapa 4)

`transcreverAudio`, `gerarSOAP` e `gerarResumo` fazem chamadas reais à
OpenAI (Whisper e GPT, via `lib/ai/providers/openai.provider.ts`),
acionadas por `/api/consultas/:id/processar-audio` e
`/api/consultas/:id/gerar-soap`.

`extrairDadosExame` continua lançando um erro explícito
(`ainda não implementado`) — a extração de dados de exame é um módulo
futuro, deliberadamente fora do escopo deste MVP (não há sequer upload
de exame pela interface ainda; ver `docs/` e `TESTE-MVP.md` para o
detalhe dessa limitação conhecida).

Pontos do código ainda marcados com `// TODO (módulo de IA)`, para
quando esse módulo futuro entrar:

- `app/api/exames/[id]/processar/route.ts`
- `app/api/pacientes/[id]/resumo/route.ts`
