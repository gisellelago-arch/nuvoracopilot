<!--
  resumo-consulta.md — Prompt da tarefa "gerar resumo da consulta"
  (aiService.gerarResumo).

  Variável esperada: {{transcricaoOuSoap}} — transcrição bruta da
  consulta ou, se já disponível, a evolução SOAP gerada.

  STATUS: ainda não consumido por nenhum código — texto preparado para
  quando a integração real com o provedor de IA for implementada.
-->

A partir do conteúdo abaixo (transcrição da consulta ou evolução SOAP já
estruturada), gere um resumo curto e legível da consulta.

Conteúdo da consulta:
"""
{{transcricaoOuSoap}}
"""

Instruções:

- O resumo deve ter no máximo 3 frases.
- Foque no motivo da consulta, no principal achado ou decisão, e no
  próximo passo (se houver retorno agendado, exame solicitado, mudança
  de medicação, etc.).
- Escreva como uma nota rápida que o próprio médico leria antes de abrir
  o prontuário oficial — direto ao ponto, sem repetir a transcrição.
- Não adicione nenhuma informação, hipótese ou conduta que não conste no
  conteúdo fornecido.

Responda em texto corrido, em português do Brasil, sem formatação
markdown.
