---
title: 'H1 — Utilitários de formatação e download'
type: 'feature'
created: '2026-09-26'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/docs/HISTORIAS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O back envia dado cru (documento, telefone e NCM sem máscara, datas ISO, dinheiro em `number`), mas as telas hoje exibem o dado já mascarado e não há onde formatar nem baixar arquivos.

**Approach:** Criar `src/app/lib/format.ts` (`formatarDocumento`, `formatarTelefone`, `formatarNcm`, `formatarMoeda`, `formatarData`, `formatarHora`, `formatarNumeroNota`) e `src/app/lib/download.ts` (`baixarArquivo(blob, nomeArquivo)`), como funções puras; entradas vazias ou `null` retornam `""` sem erro. As telas não são alteradas (o uso vem em H3 em diante).

</frozen-after-approval>

## Implementation Notes

- `formatarNumeroNota(numero, tamanho = 6)` completa com zeros à esquerda; 6 é o padrão dos mocks atuais (`000123`, `000110`).
- Datas só com dia (`2026-09-24`) são formatadas sem passar por `Date`, para o fuso não voltar um dia; datas com hora usam o horário local.
- Entradas fora do tamanho esperado (documento, telefone, NCM) voltam só com os dígitos, sem máscara.
