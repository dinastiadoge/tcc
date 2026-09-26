---
title: 'README sobre o desenvolvimento do projeto com o ciclo BMAD'
type: 'chore'
created: '2026-09-24'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O `README.md` do TCC é só o stub do export do Figma. Falta documentar como o projeto é desenvolvido e qual é o ciclo recomendado com o BMAD (brainstorming → épicos → aprovação de spec → …).

**Approach:** Reescrever `README.md` em português. Manter o conteúdo original (link do Figma, `npm i`, `npm run dev`) e acrescentar uma seção do ciclo de desenvolvimento com BMAD, com base nas skills e nas fases instaladas (BMad 6.12.0, módulos core e bmm). Diagrama Mermaid, tabela fase → skill → artefato, atalhos para mudança de rumo e retrospectiva, e o ciclo interno do `bmad-build` com seus checkpoints.

</frozen-after-approval>

## Implementation Notes

- Arquivo alterado: `README.md`. O conteúdo original (link do Figma, `npm i`, `npm run dev`) foi mantido.
- O ciclo documentado vem de `_bmad/bmm/module-help.csv` (ordem, obrigatoriedade e artefatos) e dos passos renderizados do `bmad-build` (cinco passos, checkpoint de aprovação, três camadas de revisão).
- Sem git neste diretório: `EnterWorktree` falhou, o trabalho foi feito no lugar e não houve commit.

## Spec Change Log

## Review Triage Log

Revisão: Blind Hunter (14 achados).

- medium, corrigido: versão "v6.12.0" fixa no texto. Trocada por referência a `_bmad/_config/manifest.yaml`.
- medium, corrigido: caminhos de artefatos inconsistentes na tabela. Todos agora com o prefixo `_bmad-output/`.
- medium, corrigido: "opcionais podem ser puladas quando o projeto é pequeno" não tinha fonte. Removido.
- medium, corrigido: "última chance sem custo" contradizia o bloco travado. Reescrito para explicar quem pode renegociar.
- medium, corrigido: conflito entre "sessão nova por etapa" e "Approve and continue". Adicionada orientação de quando usar cada opção.
- low, corrigido: localização do `deferred-work.md` não citada. Caminho incluído.
- low, corrigido: `/bmad-customize` e o modo status do `/bmad-sprint-planning` ausentes. Adicionados.
- low, corrigido: `Correct Course` no diagrama só apontava para a Definição. Agora também aponta para a Solução.
- false: "não diz que o BMAD está instalado". A tabela de estrutura já diz.
- rejeitado (low): setup, autor, orientador, licença e status do projeto. São dados que não constam do repositório e ficam fora do escopo do pedido.
- rejeitado (low): glossário, nomes de arquivos gerados, troubleshooting, `bmad-build-auto`, desfazer commit. Valor baixo ou exigiriam fatos não verificados.
