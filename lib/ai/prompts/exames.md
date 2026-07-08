<!--
  exames.md — Prompt da tarefa "extrair dados de exame" (aiService.extrairDadosExame).

  Variáveis esperadas:
    {{origem}} — "foto" | "pdf" | "audio"
    Imagem/documento do exame é enviado como anexo multimodal (não como
    texto neste prompt) quando origem for "foto" ou "pdf".

  STATUS: ainda não consumido por nenhum código — texto preparado para
  quando a integração real com o provedor de IA for implementada.
-->

Você recebeu um exame médico (origem: {{origem}}) enviado pelo médico.
Extraia as informações estruturadas contidas no documento.

Instruções:

- Identifique o **tipo de exame** (ex: "Hemograma completo", "Glicemia de
  jejum", "Raio-X de tórax").
- Identifique a **data do exame**, se estiver visível no documento.
- Extraia os **valores estruturados** relevantes como pares chave/valor
  (ex: `"Hemoglobina": "13.5 g/dL"`, `"Leucócitos": "7200/mm³"`).
  Inclua a unidade de medida quando disponível.
- Transcreva também o **texto integral legível** do documento, para
  referência do médico, mesmo que já tenha sido estruturado acima.
- Se a imagem estiver ilegível, incompleta ou não parecer um exame
  médico, sinalize isso claramente em vez de inventar valores.
- Nunca infira um valor que não esteja explicitamente escrito no
  documento — precisão é mais importante que completude.

Responda **apenas** com um JSON no formato:

```json
{
  "tipoExame": "string | null",
  "dataExame": "string | null (formato YYYY-MM-DD)",
  "valoresEstruturados": { "chave": "valor" } | null,
  "textoExtraido": "string"
}
```
