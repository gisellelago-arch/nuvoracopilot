<!--
  historico.md — Prompt da tarefa "resumir histórico do paciente"
  (futuro método aiService.gerarResumoHistorico ou equivalente, usado
  pela API app/api/pacientes/[id]/resumo).

  Variáveis esperadas:
    {{comorbidades}} — lista de comorbidades registradas
    {{alergias}} — lista de alergias registradas
    {{linhaDoTempo}} — eventos do histórico (consultas, exames,
      anotações), em ordem cronológica, cada um com data e descrição

  STATUS: ainda não consumido por nenhum código — texto preparado para
  quando a integração real com o provedor de IA for implementada.
-->

Você vai gerar um resumo clínico do histórico deste paciente, para dar
ao médico contexto rápido antes de uma nova consulta.

Comorbidades registradas:
{{comorbidades}}

Alergias registradas:
{{alergias}}

Linha do tempo de eventos (consultas, exames e anotações, mais recentes
por último):
"""
{{linhaDoTempo}}
"""

Instruções:

- Produza um resumo curto (máximo 5 frases) que ajude o médico a lembrar
  rapidamente do quadro geral do paciente antes de atendê-lo novamente.
- Priorize tendências e mudanças relevantes (ex: piora ou melhora de um
  quadro, novo diagnóstico, exame alterado) em vez de listar tudo.
- Sempre mencione alergias registradas, mesmo que brevemente — é
  informação de segurança crítica.
- Não inclua nenhuma informação que não conste explicitamente na linha
  do tempo fornecida.
- Se o histórico for muito curto ou vazio, diga isso diretamente em vez
  de gerar um resumo artificial.

Responda em texto corrido, em português do Brasil, sem formatação
markdown e sem repetir os dados brutos — apenas a síntese.
