# Comparativo Front × Back — WC Autopeças

Levantamento de 2026-10-13. **Front:** este repo (`src/app/types`, `src/app/services`, `docs/HISTORIAS.md`). **Back:** `TCC-autopecas`, arquivo `ARQUITETURA-BACKEND-DETALHADA.md` (seção 5 = endpoints). O back ainda é só documentação; "o back tem" significa "está descrito no doc".

Legenda: ✅ igual · ⚠️ diverge · 🟦 só no front · 🟥 só no back

> **Direção da correção ainda em aberto.** O branch `alinha-frontend` do back diz que o front deve se adaptar (IDs UUID, paginação, `itemId`). Os tipos do front dizem o contrário. Ver "Decisões necessárias" no fim.

---

## 1. Resumo

Cada tabela abaixo marca linha a linha o que é igual, o que diverge e o que existe só de um lado. As seções 2 a 4 comparam, a 5 lista as lacunas do back, a 6 as decisões e a 7 as perguntas já respondidas.

O back está bem detalhado em infraestrutura (SQS, SNS, DynamoDB, listeners), mas **magro na superfície de API que o front precisa**: faltam fornecedores, usuários/grupos, inutilização em `GET`, itens da nota, e a maioria dos endpoints do front tem outro caminho ou outro formato.

---

## 2. Endpoints, um a um

Prefixo comum: front usa `environment.apiUrl` (`/api` em produção), back usa `/api/...`.

### Autenticação

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Login | `POST /auth/login` `{email, senha}` → `{token, usuario}` | `POST /api/auth/login`, mesmo corpo → `{token, refreshToken, usuario, expiresIn}` | ✅ (campos extras ignorados pelo front) |
| Sessão | `GET /auth/me` → `Usuario` | `GET /api/auth/me` | ✅ caminho; ⚠️ `id` UUID e `papel` extra |
| Logout | — (só limpa o token local) | `POST /api/auth/logout` | 🟥 front não chama |
| Refresh | — (401 desloga) | `POST /api/auth/refresh` | 🟥 front não usa |
| Erro | `{ "message" }` | só aparece em exemplos isolados; sem formato de erro padrão documentado | ⚠️ falta padronizar |
| 403 (grupo sem acesso) | previsto na H13 | não existe 403 em nenhum endpoint | 🟦 |

### Clientes

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Listar | `GET /clientes?tipo&busca&documento` → `Cliente[]` | `GET /api/clientes?tipo&busca&cidade&uf&ativo&limit&lastKey` → `{items,lastKey,count}` | ⚠️ envelope e falta `documento` |
| Buscar por documento | `?documento=` | só `busca` numérica (cai no GSI de documento) | ⚠️ |
| Detalhe | — | `GET /api/clientes/{id}` | 🟥 |
| Criar | `POST /clientes` (`ClienteInput`) | `POST /api/clientes` | ⚠️ back exige `nomeFantasia` (PJ), `cep`, endereço |
| Editar | `PUT /clientes/{id}` | `PUT /api/clientes/{id}` | ✅ caminho, ⚠️ mesmos campos exigidos |
| Excluir | `DELETE /clientes/{id}` com confirmação | `DELETE` = desativa (`ativo=false`) | ⚠️ semântica: some da lista? |

### Produtos / estoque

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Listar | `GET /produtos?busca&status` → `Produto[]` | `GET /api/produtos?busca&categoria&status&ativo&limit` → `{items}` | ⚠️ envelope; ✅ filtros usados |
| Resumo | `GET /produtos/resumo` → `totalProdutos, estoqueBaixo, valorEmEstoque, itensCriticos` | `totalProdutos, produtosBaixo, produtosCriticos, valorTotalEstoque, ...` | ⚠️ 3 nomes diferentes |
| Criar | `POST /produtos` (envia `estoqueAtual`) | `POST /api/produtos`; estoque nasce 0 | ⚠️ |
| Editar | `PUT /produtos/{id}` (envia `estoqueAtual`) | `PUT /api/produtos/{id}`; estoque só muda por ajuste | ⚠️ |
| Excluir | `DELETE /produtos/{id}` | desativa; barra se houver reserva | ⚠️ erro 409 não previsto no front |
| Detalhe | — | `GET /api/produtos/{id}` | 🟥 |
| Movimentos | — | `GET /api/produtos/{id}/movimentos` | 🟥 |
| Ajuste manual | — | `POST /api/produtos/{id}/ajuste` | 🟥 |

### Vendas

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Criar (finalizada/orçamento) | `POST /vendas` → `Venda` | `POST /api/vendas` | ✅ corpo igual; ⚠️ resposta incompleta |
| Detalhe | — | `GET /api/vendas/{id}` | 🟥 |
| Listar | — | `GET /api/vendas` | 🟥 |
| Mudar status | — (orçamento → finalizada não existe na tela) | `PUT /api/vendas/{id}/status` | 🟥 |
| Cancelar | — | `DELETE /api/vendas/{id}` | 🟥 |
| ID da nota gerada (Q1) | precisa para "Imprimir Cupom" | só em `GET /vendas/{id}` (`notaFiscalId`) | ⚠️ |

### Fiscal

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Listar notas | `GET /notas?status&de&ate` → `NotaFiscal[]` | `GET /api/notas?status&tipo&de&ate&clienteId&limit` → `{items}` | ⚠️ envelope e campos |
| Itens da nota | `GET /notas/{id}/itens` | itens vêm dentro de `GET /notas/{id}`; rota não existe | ⚠️ |
| Detalhe | — | `GET /api/notas/{id}` | 🟥 |
| XML | `GET /notas/{id}/xml` | `GET /api/documentos/xml/{id}` | ⚠️ caminho |
| PDF | `GET /notas/{id}/pdf` | `GET /api/documentos/pdf/{id}` | ⚠️ caminho |
| Lote contador | `POST /notas/lote-contador` (sem corpo) | `POST /api/documentos/lote-contador` exige `notaIds` + `emailContador` | ⚠️ caminho e corpo |
| Relatório | `GET /notas/relatorio` → arquivo | `GET /api/relatorios/fiscal` (`de`/`ate` obrigatórios) | ⚠️ caminho |
| Cancelar | `POST /notas/{id}/cancelamento` `{justificativa}` → `NotaFiscal` | mesmo caminho e corpo → `{eventoId,status,message}` | ✅ caminho; ⚠️ resposta |
| Reenviar rejeitada | — | `POST /api/notas/{id}/reenviar` | 🟥 |
| Inutilizar | `POST /inutilizacoes` | `POST /api/notas/inutilizacao` | ⚠️ caminho |
| Histórico de inutilizações | `GET /inutilizacoes` | **não existe** | 🟦 |
| Devolução | `POST /notas/devolucao` `{notaReferenciadaId, motivo, itens:[{produtoId,quantidade,valorUnitario}]}` | mesmo caminho; itens `{itemId, quantidadeDevolver}` | ✅ caminho; ⚠️ itens |

### Entrada

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Registrar | `POST /notas/entrada`, corpo plano (`numero`, `serie`... na raiz) → `NotaFiscal` | `POST /api/entrada`, com `nota{}` aninhada → `{id,status,message}` | ⚠️ caminho, forma e resposta |
| Importar XML | `POST /notas/entrada/importar-xml` → `EntradaInput` na hora (preenche o formulário) | `POST /api/entrada/importar-xml` → 202, processa em fila e já registra | ⚠️ fluxo diferente: o front precisa de **prévia**, o back **registra direto** |
| Listar / detalhar entradas | — | `GET /api/entrada`, `GET /api/entrada/{id}` | 🟥 |

### Dashboard e relatórios

| Operação | Front chama | Back tem | Situação |
|---|---|---|---|
| Dashboard | — (Home usa listagens; Q5) | `GET /api/dashboard` com contadores de vendas, estoque, fiscal, clientes | 🟥 resolve a Q5 |
| Relatório de vendas / estoque | — | `GET /api/relatorios/vendas`, `/estoque` | 🟥 |

### O que o front tem e o back **não tem** nenhum endpoint

| Recurso | Tela do front | Observação |
|---|---|---|
| Fornecedores (CRUD) | `/fornecedores` (Q10) | o back só guarda o fornecedor dentro da nota de entrada |
| Usuários e grupos (CRUD) | `/usuarios` (Q9) | nenhum endpoint de usuário além do login |
| Grupos de acesso / permissões | guard por rota (H13, Q6, Q7) | o back tem só `papel` (um valor, sem matriz) |
| Histórico de inutilizações | `/inutilizacao` | só `POST` |
| Prévia do XML de entrada | `/entrada` | ver acima |
| Cadastro rápido de cliente no PDV | modal (Q8) | existe `POST /clientes`, mas exige campos que o modal não pede |
| Contadores de clientes por tipo | `/clientes` (Q5) | o dashboard só traz total/ativos/novos |
| Filtro de estoque com vários status | Home (Q5) | `status` aceita um valor |

---

## 3. Modelos de dados

### Cliente

| Campo | Front | Back | Situação |
|---|---|---|---|
| `id` | `number` | UUID | ⚠️ |
| `tipo`, `documento` (cru), `nome`, `email`, `telefone` (cru), `cidade`, `uf` | sim | sim | ✅ |
| `ativo` | `boolean` | `boolean` | ✅ |
| `totalCompras` | `number` | `number` | ✅ |
| `ultimaCompra` | ISO ou `null` | ISO | ✅ |
| `nomeFantasia`, `inscricaoEstadual`, `cep`, `logradouro`, `numero`, `complemento`, `bairro` | — | sim | 🟥 |
| `valorTotalCompras`, `dataCriacao`, `dataAtualizacao` | — | sim | 🟥 |

### Produto

| Campo | Front | Back | Situação |
|---|---|---|---|
| `codigo`, `nome`, `ncm` (cru), `precoCusto`, `precoVenda`, `estoqueMinimo` | sim | sim | ✅ |
| `estoqueAtual` | plano | na lista plano; no detalhe dentro de `estoque{}` | ⚠️ inconsistente dentro do próprio back |
| `status` (`ok/atencao/baixo/critico`) | sim, calculado no back | sim; regra 0,4 / 0,7 / 1,0 igual à do front | ✅ |
| `categoria`, `fabricante`, `codigoFabricante`, `descricao`, `cest` | — | sim | 🟥 |
| `cfop`, `origem`, `cstIcms`, `aliquotaIcms` | — | sim (fiscal) | 🟥 |
| `reservado`, `disponivel`, `margemLucro`, `ativo` | — | sim | 🟥 |
| Validação "preço de venda > custo" | não valida | sim | ⚠️ |

### Venda

| Campo | Front | Back | Situação |
|---|---|---|---|
| Corpo do `POST` (`tipoDocumento`, `modalidade`, `clienteId`, `metodoPagamento`, `bandeira`, `destinoDinheiro`, `desconto`, `status`, `itens`) | sim | sim | ✅ |
| `bandeira` só se cartão, `destinoDinheiro` só se dinheiro | sim | sim | ✅ |
| NF-e exige cliente, NFC-e aceita `null` | sim | sim | ✅ |
| Desconto ≤ subtotal | pendente (Q2) | sim | ✅ (responde a Q2) |
| Estoque insuficiente → 409 | pendente (Q2) | sim | ✅ (responde a Q2) |
| `status` | `orcamento / finalizada` | + `cancelada` | ⚠️ front sem `cancelada` |
| `id` | `number` | UUID | ⚠️ |
| Resposta do `POST` | `Venda` inteira | `id, numero, tipoDocumento, subtotal, desconto, total, status, criadaEm, itens` | ⚠️ faltam `modalidade`, `clienteId`, `metodoPagamento`... |
| `numero` (`VD-000126`), `vendedorId`, `notaFiscalId`, `finalizadaEm` | — | sim | 🟥 |

### Nota fiscal

| Campo | Front | Back (lista) | Situação |
|---|---|---|---|
| `id`, `tipo`, `numero`, `serie`, `chaveAcesso`, `valorTotal`, `emitidaEm`, `status` | sim | sim | ✅ (⚠️ `id` UUID) |
| `clienteNome` | sim | `cliente` (string) | ⚠️ nome do campo |
| `clienteDocumento`, `clienteId`, `fornecedorId`, `vendaId`, `notaReferenciadaId` | sim | só no detalhe (`vendaId`, `clienteId`) | ⚠️ ausentes na lista |
| `status` | `autorizada / cancelada / processando` | + `rejeitada` | ⚠️ |
| `protocolo`, `modelo`, `codigoStatus`, `ambiente`, `tentativasEnvio`, `valorIcms`, `autorizadaEm`, `xmlPath`, `pdfPath` | — | sim | 🟥 |

### Item da nota

| Campo | Front | Back | Situação |
|---|---|---|---|
| `codigo`, `descricao`, `ncm`, `cfop`, `quantidade`, `valorUnitario` | sim | sim | ✅ |
| `produtoId` | `number \| null` | UUID | ⚠️ |
| `itemId` (identifica o item na nota) | — | exigido na devolução | 🟥 |

### Inutilização

| Campo | Front | Back (resposta do POST) | Situação |
|---|---|---|---|
| `serie`, `numeroInicial`, `numeroFinal` (number) | sim | sim | ✅ |
| `justificativa`, `registradaEm`, `protocolo` | sim | ausentes na resposta | ⚠️ |
| `quantidade`, `status` | — | sim | 🟥 |
| Regra `final ≥ inicial`, justificativa ≥ 15 | sim | sim | ✅ |
| Regra "sem nota autorizada na faixa" | — | sim | 🟥 |

### Usuário

| Campo | Front | Back | Situação |
|---|---|---|---|
| `nome`, `email` | sim | sim | ✅ |
| `id` | `number` | UUID | ⚠️ |
| Grupo de acesso | `GrupoAcesso` provisório | `papel` (ex.: `ADMIN`) | ⚠️ nomes e quantidade a combinar (Q6) |
| `ativo`, senha ≥ 8 (tela `/usuarios`) | sim | `ativo` interno; sem CRUD | 🟦 |

### Fornecedor

| Campo | Front | Back | Situação |
|---|---|---|---|
| `cnpj`, `razaoSocial`, `ie`, `uf` | sim | sim, **dentro da nota de entrada** | ✅ campos; 🟦 cadastro próprio |

---

## 4. Regras de negócio

| Regra | Front | Back | Situação |
|---|---|---|---|
| Status do estoque (0,4 / 0,7 / 1,0 × mínimo) | back calcula | idem, regra descrita duas vezes (linhas 584 e 2606) | ✅ |
| Cancelamento só `autorizada`, até 24 h, justificativa ≥ 15 | tela valida justificativa; prazo é do back | back valida os três | ✅ |
| Devolução: itens da nota original, `qtd ≤ original`, ≥ 1 item | sim | sim | ✅ |
| Devolução: motivo obrigatório? | indefinido (Q4) | não diz | ⚠️ ambos omissos |
| Devolução: adicionar item que não estava na nota | indefinido (Q4) | proíbe ("itens devem pertencer à nota original") | ✅ responde à Q4 |
| Entrada: CNPJ válido, chave 44 dígitos, `dataEntrada ≥ dataEmissao`, ≥ 1 item | planejado (H10) | sim | ✅ |
| Entrada soma ao estoque | só informa | sim, por evento | ✅ |
| UF entre as 27 válidas | planejado (H14) | só "2 caracteres" | ⚠️ |
| Documento válido (dígitos verificadores) | helper `documento.ts` | "CPF/CNPJ válido conforme algoritmo" | ✅ |
| Telefone 10 ou 11 dígitos | máscara 10/11 | validação 10/11 | ✅ |
| E-mail único de cliente | não valida | sim (409) | ⚠️ front sem tratamento do 409 |
| Documento único de cliente | planejado | sim (409) | ✅ |
| NCM 8 dígitos | planejado (H4) | sim | ✅ |
| Código de produto único | planejado (H4) | sim (409) | ✅ |
| Bloqueio após 5 logins errados (423, 15 min) | mostra `message` | sim | ✅ (⚠️ tratar status 423) |
| Último admin ativo não pode ser removido | sim (mock) | sem usuários | 🟦 |

---

## 5. Onde o back está simplório (do ponto de vista do front)

1. **Nenhum CRUD de fornecedor nem de usuário/grupo.** Duas telas inteiras do front sem endpoint.
2. **Autorização inexistente.** Sem grupos, sem matriz de permissões, sem 403. Só `papel` num campo.
3. **Inutilização sem histórico** (`GET`). A tela mostra o histórico.
4. **Sem prévia de XML.** A importação registra direto; o front precisa mostrar e confirmar antes.
5. **Cliente com cadastro pesado demais para o PDV.** Endereço completo e nome fantasia travam o "cadastrar na hora".
6. **Contadores prontos só no dashboard**, e sem filtro por tipo de cliente, sem "notas do dia" por status, sem estoque baixo+crítico juntos.
7. **Respostas de escrita pobres.** Cancelamento, entrada e inutilização devolvem só `message`/`id`, sem o objeto atualizado que a tela precisa para refrescar a lista.
8. **Fluxos assíncronos sem como acompanhar.** Cancelamento e inutilização ficam `processando`, mas não há endpoint de consulta do evento nem push (a tela precisa de polling ou do status da nota).
9. **Formato de erro não padronizado.** O front depende de `{ "message" }`.
10. **Paginação por cursor sem ordenação nem total** (`count` é o tamanho da página). O front mostra totais ("Total de clientes: N").
11. **Caminhos fiscais espalhados em 4 serviços** (`/notas`, `/documentos`, `/relatorios`, `/entrada`) enquanto o front espera tudo sob `/notas`. Resolvível no API Gateway, mas precisa constar no doc.
12. **Dados fiscais ausentes do front.** O back guarda CFOP, CST, alíquota de ICMS, origem; o front não tem onde preencher (o cadastro de produto não pede). Quem informa esses campos?

---

## 6. Decisões necessárias

| # | Decisão | Opções | Recomendação |
|---|---|---|---|
| D1 | Tipo do ID | `number` (front hoje) ou UUID `string` | UUID `string`; ajustar `types/` do front (muda quase tudo que usa `id`) |
| D2 | Listagens | array puro ou `{items,lastKey,count}` | envelope + paginação no front (H3, H4, H6 ganham "carregar mais") |
| D3 | Caminhos fiscais | front muda para `/documentos`, `/relatorios`, `/entrada` ou back expõe aliases em `/notas` | aliases no gateway; menos retrabalho nas telas |
| D4 | Cliente | campos de endereço opcionais no back ou modal maior no front | opcionais no back (PDV precisa de cadastro rápido) |
| D5 | Estoque em `PUT /produtos` | ignorar `estoqueAtual` e usar `/ajuste`, ou aceitar e gerar movimento | aceitar e gerar movimento com motivo automático |
| D6 | Importar XML | back devolve prévia (`EntradaInput`) e registro é um passo à parte, ou registro direto | prévia primeiro |
| D7 | Devolução | `itemId` + `quantidadeDevolver` (back) ou `produtoId` + `quantidade` + `valorUnitario` (front) | `itemId` (garante que o item pertence à nota); front passa a guardar `itemId` |
| D8 | `rejeitada` e `cancelada` | adicionar ao `StatusNota` / `StatusVenda` do front | adicionar |
| D9 | Fornecedores e usuários | back cria os CRUDs ou as telas saem do front (Q9, Q10) | decisão de produto |
| D10 | Grupos e permissões | definir nomes e matriz (Q6, Q7) | bloqueia H13 |

---

## 7. Perguntas do `HISTORIAS.md` que o doc do back já responde

| Pergunta | Resposta do back |
|---|---|
| Q2 (desconto, estoque insuficiente) | desconto ≤ subtotal; estoque insuficiente = `409 Conflict` |
| Q4 (item fora da nota original) | proibido |
| Q5 (contadores) | existem em `GET /api/dashboard`; filtro de status é um por vez |
| Q6 (um grupo ou vários) | um só (`papel`); nomes ainda não definidos |
| Q1 (id da nota na venda) | não responde: só no `GET /vendas/{id}`; a emissão é assíncrona (`processando`) |
| Q3, Q7, Q8, Q9, Q10 | sem resposta |
