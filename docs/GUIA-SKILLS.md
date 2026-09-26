# Guia rápido das skills

Uma *skill* é um fluxo pronto que você chama no Claude Code digitando `/nome-da-skill`. Este guia diz, em uma linha, **o que cada uma faz e quando usar**. Para o fluxo completo do método, veja o `README.md` (seção "Desenvolvimento com BMAD").

**Dicas de uso**

- Em dúvida sobre o próximo passo, rode `/bmad-help`. Ele lê o estado do projeto e recomenda a skill.
- Use **uma sessão nova por skill**: os documentos em `_bmad-output/` guardam o estado entre elas.
- Skills marcadas com **(obrigatória)** são exigidas pelo catálogo do BMAD; as demais são opcionais.
- Ao chamar uma skill, você pode passar um argumento na mesma linha (ex.: `/bmad-spec docs/HISTORIAS.md`).

---

## 1. Qual skill uso? (atalho)

| Quero… | Use |
|---|---|
| Saber o que fazer agora | `/bmad-help` |
| Gerar ideias | `/bmad-brainstorming` |
| Testar se uma ideia se sustenta | `/bmad-forge-idea` |
| Pesquisar mercado, tecnologia ou concorrentes | `/bmad-deep-recon` |
| Definir **o que** construir (requisitos) | `/bmad-prd` |
| Definir **como** construir (decisões técnicas, ex.: grupos de acesso, formato de token) | `/bmad-architecture` |
| Quebrar em épicos e histórias | `/bmad-create-epics-and-stories` |
| Ver o andamento da sprint | `/bmad-sprint-planning` (modo status) |
| Implementar uma história | `/bmad-build` |
| Revisar código ou documento | `/bmad-review` ou `/bmad-code-review` |
| Mudar o plano no meio do caminho | `/bmad-correct-course` |
| Resumir anotações soltas num spec curto | `/bmad-spec` |
| Conversar com um papel específico (analista, PM, arquiteto…) | `/bmad-agent-*` |

---

## 2. Fluxo do método (na ordem)

### Descoberta (opcional)

| Skill | Faz | Gera |
|---|---|---|
| `/bmad-brainstorming` | Sessão guiada de ideias com técnicas criativas | `_bmad-output/brainstorming/` |
| `/bmad-forge-idea` | Interroga a ideia com várias personas até você decidir agir ou largar. Pode passar o resultado ao `bmad-spec` ou `bmad-build` | brief opcional em `_bmad-output/forge/` |
| `/bmad-deep-recon` | Pesquisa para apoiar uma decisão: monta um prompt para você rodar em outra IA, resume um relatório pronto, ou pesquisa na web aqui mesmo. Tipos: `market`, `domain`, `technical`, `competitive`, `user-voice`, `academic-lit` | relatório em `planning-artifacts/research/` |
| `/bmad-product-brief` | Conversa guiada que resume a ideia do produto (alternativa leve ao PRFAQ) | brief em `planning-artifacts/` |
| `/bmad-prfaq` | "Working Backwards" da Amazon: escreve o comunicado de imprensa do produto pronto e responde perguntas duras para testar o conceito | documento PRFAQ |

### Definição

| Skill | Faz | Gera |
|---|---|---|
| `/bmad-prd` **(obrigatória)** | Cria, atualiza ou valida o PRD: *o quê* e *por quê*, incluindo quem acessa o quê | PRD em `planning-artifacts/` |
| `/bmad-ux` | Registra a visão de UX em dois documentos: aparência (`DESIGN.md`) e comportamento (`EXPERIENCE.md`). Recomendada quando a interface é central, como neste projeto | `planning-artifacts/` |

### Solução

| Skill | Faz | Gera |
|---|---|---|
| `/bmad-architecture` **(obrigatória)** | Registra as decisões técnicas que mantêm as partes do sistema consistentes. Pode documentar as convenções de um código que já existe | documento de arquitetura |
| `/bmad-create-epics-and-stories` **(obrigatória)** | Quebra PRD + arquitetura em épicos e histórias com critérios de aceite | épicos e histórias |
| `/bmad-sprint-planning` **(obrigatória)** | Confere se o planejamento está completo (PASS, CONCERNS ou FAIL) e gera o arquivo de status da sprint | `implementation-artifacts/sprint-status.yaml` |

`/bmad-sprint-planning` também tem o **modo status** (resume andamento, riscos e próxima ação) e valida ou repara o arquivo de status.

### Entrega

| Skill | Faz | Gera |
|---|---|---|
| `/bmad-build` **(obrigatória)** | Implementa **uma história por vez**: entende o pedido → planeja (spec) → você aprova → implementa → 3 revisores independentes → commit local. Mudanças pequenas seguem uma rota curta, sem parada para aprovação | spec da história + código |
| `/bmad-build-auto` | Uma iteração de um laço de desenvolvimento **sem supervisão**. Só chame pelo nome, quando souber o que está fazendo | — |
| `/bmad-code-review` | Revisão extra de qualquer mudança, depois da revisão embutida no build | relatório |
| `/bmad-qa-generate-e2e-tests` | Gera testes automatizados de API e ponta a ponta para o que foi implementado | suíte de testes |
| `/bmad-walkthrough` | Roteiro guiado para você revisar uma mudança: para que serve, o que olhar de perto e como testar | — |
| `/bmad-retrospective` | Ao fim de um épico: revisa o que foi feito, lições aprendidas e próximos passos | retrospectiva |

> No checkpoint do `/bmad-build` você escolhe: **Approve and continue** (segue na mesma sessão), **Approve and stop** (para e retoma numa sessão limpa) ou **Review spec** (ajusta o spec antes de aprovar). Depois de aprovado, a intenção do spec fica travada.

---

## 3. Apoio (a qualquer momento)

| Skill | Faz |
|---|---|
| `/bmad-help` | Diz onde você está e qual é o próximo passo |
| `/bmad-correct-course` | Avalia o impacto de uma mudança grande no PRD, na arquitetura e nas histórias e propõe o que refazer |
| `/bmad-spec` | Condensa qualquer material (brief, PRD, transcrição, anotações) num `SPEC.md` curto. Também valida, atualiza e pode quebrar em histórias. **Não confunda** com o spec de história do `bmad-build` |
| `/bmad-project-context` | Cria ou atualiza o `AGENTS.md` (comandos, convenções e armadilhas do repositório) para os agentes trabalharem melhor |
| `/bmad-review` | Revisa qualquer coisa antes de entregar (código, PRD, spec, arquitetura, texto) com "lentes": crítica adversarial, casos de borda, lacunas de verificação, estrutura e prosa |
| `/bmad-advanced-elicitation` | Pega um rascunho recém-feito e o empurra além da primeira versão (pré-mortem, primeiros princípios, red team, socrático) |
| `/bmad-party-mode` | Discussão em grupo entre vários agentes, para ver perspectivas diferentes |
| `/bmad-customize` | Muda o comportamento de um agente ou fluxo sem editar TOML à mão (grava em `_bmad/custom/`). Use isto em vez de mexer em `_bmad/` |

---

## 4. Agentes com personalidade

Conversam com você no papel indicado, em vez de rodar uma skill direta:

| Skill | Agente | Papel |
|---|---|---|
| `/bmad-agent-analyst` | Mary | Análise de negócio e pesquisa |
| `/bmad-agent-pm` | John | Produto e PRD |
| `/bmad-agent-ux-designer` | Sally | UX e interface |
| `/bmad-agent-architect` | Winston | Arquitetura |
| `/bmad-agent-dev` | Amelia | Implementação de histórias |

---

## 5. Skills gerais do Claude Code (fora do BMAD)

| Skill | Faz |
|---|---|
| `/code-review` | Revisa o diff atual (ou um PR/branch) atrás de bugs. Aceita nível (`low` a `max`); `--fix` aplica as correções |
| `/simplify` | Revisa o código alterado e aplica limpezas de reuso, simplicidade e eficiência (não caça bugs) |
| `/security-review` | Revisão de segurança das mudanças pendentes no branch |
| `/init` | Cria um `CLAUDE.md` com a documentação do código |
| `/run` | Sobe o app do projeto para ver uma mudança funcionando de verdade |
| `/loop` | Repete um prompt ou skill em intervalo (ex.: `/loop 5m /bmad-help`) |
| `/schedule` | Agenda agentes na nuvem (rotinas) para rodar em horário fixo |
| `/update-config`, `/keybindings-help`, `/fewer-permission-prompts` | Ajustam configurações, atalhos e reduzem pedidos de permissão |
| `/docx`, `/pptx`, `/xlsx`, `/pdf` | Criam ou editam arquivos Word, PowerPoint, Excel e PDF |
| `/skill-creator` | Cria, testa e melhora skills próprias |

> `/code-review` e `/security-review` usam git. Este diretório **não é um repositório git** ainda; rode `git init` antes (o `bmad-build` também usa o commit atual como base da mudança).

---

## 6. Sugestão para este projeto

O que já existe: o spec do README (feito com `bmad-build`), o `docs/MAPEAMENTO-CLASSES.md` e o `docs/HISTORIAS.md`. Ainda faltam PRD, arquitetura, épicos e sprint. Ordem sugerida:

1. `/bmad-prd`: requisitos, incluindo grupos de acesso (perguntas Q6 e Q7 do `HISTORIAS.md`).
2. `/bmad-ux` (opcional): a maior parte do projeto é interface.
3. `/bmad-architecture`: token em `sessionStorage`, contrato de erros, guard de rota; pode documentar o código atual.
4. `/bmad-create-epics-and-stories`: aproveita o `HISTORIAS.md` como ponto de partida.
5. `/bmad-sprint-planning`: gera o status da sprint.
6. `/bmad-build`: uma história por vez.

Comece cada uma numa sessão nova e, se travar, `/bmad-help`.
