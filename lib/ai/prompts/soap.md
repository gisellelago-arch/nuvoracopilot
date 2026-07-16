<!--
  soap.md — Prompt da tarefa "gerar SOAP" (aiService.gerarSOAP).

  Variável esperada: {{transcricao}} — texto transcrito literal da consulta.

  ETAPA 3: este prompt agora também é responsável por filtrar conversa
  social/irrelevante antes de montar o SOAP. A transcrição literal
  continua sendo salva e exibida integralmente em outro lugar do
  sistema (para conferência) — este filtro afeta SOMENTE o que entra
  no SOAP e nos "pontos para confirmar", nunca a transcrição salva.

  STATUS: consumido por lib/ai/providers/openai.provider.ts (gerarSOAP).
-->

A partir da transcrição de consulta abaixo, gere uma evolução clínica no
formato SOAP (Subjetivo, Objetivo, Avaliação, Plano).

Transcrição da consulta:
"""
{{transcricao}}
"""

PIPELINE INTERNO (siga mentalmente esta ordem, sem mostrar os passos
intermediários na resposta):

1. Releia a transcrição literal.
2. Extraia apenas os fatos clinicamente relevantes.
3. Descarte conversa social ou assuntos sem relação com a saúde do
   paciente.
4. Monte o SOAP somente com o que restou.

CLASSIFIQUE internamente cada trecho da transcrição em uma destas três
categorias antes de decidir se ele entra no SOAP:

1. Clinicamente relevante — sintomas, duração, intensidade, evolução,
   sinais vitais, exame físico, resultados, avaliação e condutas
   verbalizadas pelo médico.
2. Potencialmente relevante, mas ambígua — pode ter importância
   clínica, mas não está claro (ex.: menção solta a viagem, mudança de
   rotina, evento recente sem sintoma associado). Isso NÃO entra em
   nenhuma seção do SOAP diretamente — só pode aparecer na lista
   "pontosParaConfirmar", e apenas quando puder ter relevância clínica.
3. Social ou irrelevante — deve ser eliminada totalmente do SOAP.

IGNORE (categoria 3, eliminar totalmente do SOAP) trechos como:
- cumprimentos e conversa de cortesia;
- compras, veículos, bens pessoais sem relação com saúde;
- futebol, esportes em geral;
- clima;
- piadas;
- teste de microfone ou de gravação;
- repetições e interrupções sem conteúdo novo;
- comentários sobre familiares sem relação com a saúde do paciente;
- assuntos cotidianos sem associação com sintomas ou contexto clínico.

EXCEÇÃO CONTEXTUAL: um evento aparentemente social pode se tornar
clinicamente relevante se estiver associado a um sintoma ou contexto
clínico. Por exemplo, "viajei no mês passado" isoladamente é
irrelevante e deve ser ignorado; já "viajei e dois dias depois comecei
com febre e manchas" é relevante e deve ser mantido (a viagem entra
como contexto do quadro, no Subjetivo).

REGRAS DE CADA SEÇÃO DO SOAP:

- Subjetivo: sintomas, duração, intensidade, evolução e informações
  relatadas pelo paciente. Use a perspectiva do paciente, sem
  interpretação clínica.
- Objetivo: somente sinais vitais, exame físico, achados observados e
  resultados mencionados explicitamente na transcrição. Não inclua
  nada que não tenha sido dito.
- Avaliação: somente avaliação ou hipótese explicitamente informada
  pelo médico na consulta. Nunca invente diagnóstico, CID ou hipótese
  que o médico não tenha verbalizado.
- Plano: somente condutas, prescrições, exames, encaminhamentos e
  retorno realmente mencionados na consulta.

Quando uma seção não tiver informação suficiente na transcrição,
escreva exatamente:
- "Não informado." para Subjetivo, Objetivo e Plano.
- "Não informada." para Avaliação.

Nunca invente dados, medicamentos, exames, CID ou condutas que não
constem explicitamente na transcrição.

"pontosParaConfirmar": liste, em português, itens da categoria 2
(potencialmente relevantes, mas ambíguos) que o médico pode querer
confirmar com o paciente antes de fechar o prontuário. Se não houver
nenhum, retorne uma lista vazia — nunca invente um ponto para
preencher a lista.

Não inclua nesta resposta nenhuma lista de conversas sociais
descartadas nem explicações sobre o que foi removido — a filtragem é
interna e não deve aparecer para o médico.

Responda **apenas** com um JSON no formato:

```json
{
  "subjetivo": "string",
  "objetivo": "string",
  "avaliacao": "string",
  "plano": "string",
  "pontosParaConfirmar": ["string"]
}
```
