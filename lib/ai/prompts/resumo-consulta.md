<!--
  resumo-consulta.md — Prompt da tarefa "gerar resumo da consulta"
  (aiService.gerarResumo).

  Variável esperada: {{transcricaoOuSoap}} — transcrição bruta da
  consulta ou, se já disponível, a evolução SOAP gerada.

  ETAPA 3: o resumo deve conter apenas informação clinicamente
  relevante. A transcrição literal completa continua salva e exibida
  à parte (para conferência) — este filtro afeta somente o texto do
  resumo, nunca a transcrição salva.

  STATUS: consumido por lib/ai/providers/openai.provider.ts (gerarResumo).
-->

A partir do conteúdo abaixo (transcrição da consulta ou evolução SOAP já
estruturada), gere um resumo curto e legível da consulta.

Conteúdo da consulta:
"""
{{transcricaoOuSoap}}
"""

FILTRO CLÍNICO (aplique antes de escrever o resumo):

Classifique mentalmente cada informação como:
1. Clinicamente relevante — use no resumo.
2. Potencialmente relevante, mas ambígua — só use no resumo se puder
   ter importância clínica no contexto (ver EXCEÇÃO CONTEXTUAL abaixo).
3. Social ou irrelevante — nunca inclua no resumo.

IGNORE completamente (categoria 3): cumprimentos, compra de bens
pessoais (ex.: carro), futebol ou esportes, clima, piadas, teste de
microfone, repetições, interrupções, comentários sobre familiares sem
relação com a saúde do paciente, e qualquer assunto cotidiano sem
associação com sintomas ou contexto clínico.

EXCEÇÃO CONTEXTUAL: um evento aparentemente social pode ser
clinicamente relevante se estiver associado a um sintoma. Por exemplo,
"viajei no mês passado" isoladamente é irrelevante; "viajei e dois
dias depois comecei com febre e manchas" é relevante e deve ser
mantido, preservando a relação temporal entre os dois fatos.

Instruções:

- O resumo deve ter no máximo 3 frases.
- Foque no motivo da consulta, no principal achado ou decisão, e no
  próximo passo (se houver retorno agendado, exame solicitado, mudança
  de medicação, etc.).
- Escreva como uma nota rápida que o próprio médico leria antes de abrir
  o prontuário oficial — direto ao ponto, sem repetir a transcrição.
- Não adicione nenhuma informação, hipótese ou conduta que não conste no
  conteúdo fornecido.
- Não mencione, nem resuma, os assuntos descartados pelo filtro
  clínico — eles simplesmente não devem aparecer no texto.

Responda em texto corrido, em português do Brasil, sem formatação
markdown.
