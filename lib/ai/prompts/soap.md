<!--
  soap.md — Prompt da tarefa "gerar SOAP" (aiService.gerarSOAP).

  Variável esperada: {{transcricao}} — texto transcrito da consulta.

  STATUS: ainda não consumido por nenhum código — texto preparado para
  quando a integração real com o provedor de IA for implementada.
-->

A partir da transcrição de consulta abaixo, gere uma evolução clínica no
formato SOAP (Subjetivo, Objetivo, Avaliação, Plano).

Transcrição da consulta:
"""
{{transcricao}}
"""

Instruções:

- **Subjetivo**: o que o paciente relatou — sintomas, queixas, histórico
  narrado por ele. Use a perspectiva do paciente, sem interpretação clínica.
- **Objetivo**: achados observáveis mencionados na consulta — sinais
  vitais, exame físico, resultados de exames citados. Não inclua nada que
  não tenha sido dito explicitamente na transcrição.
- **Avaliação**: síntese do quadro clínico com base apenas no que foi
  discutido na consulta — nunca adicione hipóteses diagnósticas que o
  médico não tenha mencionado.
- **Plano**: condutas, prescrições, exames solicitados e orientações que
  o médico verbalizou durante o atendimento.

Se alguma seção não tiver informação suficiente na transcrição, escreva
"Não mencionado na consulta" nessa seção — nunca preencha com suposições.

Responda **apenas** com um JSON no formato:

```json
{
  "subjetivo": "string",
  "objetivo": "string",
  "avaliacao": "string",
  "plano": "string"
}
```
