# Histórias de integração front ↔ back — WC Autopeças

Backlog vivo da integração. **Ao retomar o trabalho, leia só este arquivo**: cada história traz os arquivos, o serviço, o mapeamento de campos (antigo → novo) e os critérios de aceite, então não é preciso reler as telas para começar. Detalhes de modelo, regras e endpoints estão em [`MAPEAMENTO-CLASSES.md`](./MAPEAMENTO-CLASSES.md).

**Regra de manutenção:** ao concluir uma história, mude o status aqui e registre a data e decisões novas no fim do arquivo (seção "Registro").

Legenda: `Feito` · `Pendente` · `Bloqueada` (depende de decisão do back, ver "Perguntas em aberto").

## Painel

| ID | História | Status |
|---|---|---|
| H0.1 | Tipos compartilhados | Feito |
| H0.2 | Cliente HTTP e serviços | Feito |
| H0.3 | Token em `sessionStorage` e auth assíncrono | Feito |
| H0.4 | Documentação de mapeamento de classes | Feito |
| H1 | Utilitários de formatação e download | Pendente |
| H2 | Checagem de tipos (`tsconfig` + `tsc`) | Pendente |
| H3 | Clientes integrado | Pendente |
| H4 | Estoque integrado | Pendente |
| H5 | PDV integrado | Bloqueada (Q1, Q2) |
| H6 | Painel Fiscal integrado | Bloqueada (Q3) |
| H7 | Cancelamento integrado | Pendente |
| H8 | Inutilização integrada | Pendente |
| H9 | Nota de Devolução integrada | Bloqueada (Q4) |
| H10 | Nota de Entrada integrada | Pendente |
| H11 | Cards do Home integrados | Pendente |
| H12 | Remoção de mocks e limpeza final | Pendente |
| H13 | Guard de rota por grupo de acesso | Bloqueada (Q6, Q7) |

Ordem sugerida: H1 → H2 → H3 → H4 → H7 → H8 → H10 → H5 → H6 → H9 → H11 → H13 → H12. (H13 pode subir na fila assim que Q6 e Q7 forem respondidas; ela só depende de H0.3.)

---

## Convenções (valem para todas as histórias)

- **Serviços** vêm de `src/app/services` (ex.: `import { clientesService } from "../services"`). Tipos vêm de `src/app/types`.
- **Dado cru do back, formatação na tela:** documento, telefone e NCM sem máscara; datas ISO 8601; dinheiro em `number`.
- **Erro:** capturar `ApiError` e mostrar `error.message`. Status `0` = sem conexão.
- **Carregamento:** cada tela ganha estado `carregando` e `erro` (hoje só há `enviando`/`sucesso`).
- **Campos só de UI** (`editandoPreco`, `precoTemp`) nunca vão no payload.
- Toda `interface` local de página é trocada pelo tipo de `types/`.

---

## Feitas

### H0.1 — Tipos compartilhados
`src/app/types/index.ts`: entidades (`Usuario`, `Cliente`, `Produto`, `Fornecedor`, `Venda`, `VendaItem`, `NotaFiscal`, `NotaFiscalItem`, `Inutilizacao`), enums (`TipoPessoa`, `TipoDocumento`, `Modalidade`, `MetodoPagamento`, `BandeiraCartao`, `DestinoDinheiro`, `StatusEstoque`, `StatusNota`, `TipoNota`, `StatusVenda`) e payloads (`ClienteInput`, `ProdutoInput`, `VendaInput`, `DevolucaoInput`, `EntradaInput`, `InutilizacaoInput`, `LoginResponse`, `ResumoEstoque`).

### H0.2 — Cliente HTTP e serviços
`src/app/services/http.ts` (`request`, `requestBlob`, `ApiError`, Bearer token, `VITE_API_URL` com padrão `/api`) e um serviço por recurso:

| Serviço | Métodos |
|---|---|
| `authService` | `login(email, senha)`, `me()` |
| `clientesService` | `listar({tipo,busca,documento})`, `criar`, `atualizar(id,…)`, `excluir(id)` |
| `produtosService` | `listar({busca,status})`, `resumo()`, `criar`, `atualizar(id,…)`, `excluir(id)` |
| `vendasService` | `criar(VendaInput)` |
| `notasService` | `listar({status,de,ate})`, `itens(id)`, `baixarXml(id)`, `baixarPdf(id)`, `relatorio(filtro)`, `enviarLoteContador()`, `cancelar(id,justificativa)`, `emitirDevolucao`, `registrarEntrada`, `importarXmlEntrada(File)` |
| `inutilizacoesService` | `listar()`, `criar(InutilizacaoInput)` |

`.env.example` com `VITE_API_URL`.

### H0.3 — Token em `sessionStorage` e auth assíncrono
- Token **só** em `sessionStorage["wc_token"]` (`services/tokenStorage.ts`), nunca `localStorage`.
- `AuthContext`: `login()` é `Promise<boolean>`; com token salvo, valida em `GET /auth/me` antes de renderizar (`carregando`); 401 limpa o token e desloga; remove o resíduo `localStorage["wc_user"]`.
- `Layout` aguarda `carregando`. `Login` sem credencial fixa, sem e-mail pré-preenchido e sem atraso simulado.
- Contrato esperado: `POST /auth/login` → `{ token, usuario }`; `GET /auth/me` → `Usuario`; erros `{ message }`.
- Sem o back no ar o login falha.

### H0.4 — Documentação
`docs/MAPEAMENTO-CLASSES.md` (modelos, regras de negócio, endpoints, inconsistências) e este arquivo.

---

## Pendentes

### H1 — Utilitários de formatação e download
**Por quê:** o back envia dado cru; hoje as telas exibem o dado já mascarado.
**Criar** `src/app/lib/format.ts`: `formatarDocumento(cpfCnpj)` (11 dígitos → CPF, 14 → CNPJ), `formatarTelefone`, `formatarNcm` (`87083010` → `8708.30.10`), `formatarMoeda(n)` (`R$ 1.250,00`), `formatarData(iso)` (`dd/MM/yyyy`), `formatarHora(iso)` (`HH:mm`), `formatarNumeroNota` se necessário.
**Criar** `src/app/lib/download.ts`: `baixarArquivo(blob, nomeArquivo)` (cria `<a download>` temporário).
**Aceite:** funções puras; entradas vazias/`null` retornam `""` sem erro.

### H2 — Checagem de tipos
**Por quê:** não existe `tsconfig.json`; o `vite build` não checa tipos, então erros de tipo passam despercebidos.
**Fazer:** adicionar `tsconfig.json` (React JSX, `strict`, alias `@` → `src`, `types: ["vite/client"]`), dependência `typescript` e script `"typecheck": "tsc --noEmit"`. Corrigir o que aparecer (o código atual pode ter erros; os arquivos de `ui/` podem ser excluídos do escopo se poluírem).
**Aceite:** `npm run typecheck` passa.

### H3 — Clientes integrado
**Arquivos:** `pages/Clientes.tsx`. **Serviço:** `clientesService`.
**Mapeamento:** `status: "ativo"|"inativo"` → `ativo: boolean`; `documento` mascarado → cru (formatar na exibição); `ultimaCompra` `dd/MM/yyyy` → ISO ou `null`; `Cliente` local → `types/Cliente`.
**Fazer:**
- Carregar com `listar({ tipo, busca })` (filtro no back, com *debounce* de ~300 ms na busca). As estatísticas (total, PF, PJ, ativos) continuam derivadas da lista completa: buscar sem filtro ou usar contadores do back (Q5).
- "Novo Cliente" e "Editar": criar modal de formulário (não existe hoje; seguir o padrão de `ModalEditarProduto` em `Estoque.tsx`) com `ClienteInput`. "Excluir": confirmação + `excluir(id)`.
- Estados de carregando, erro e lista vazia.
**Aceite:** CRUD funciona contra o back; lista atualiza após cada operação; erro do back aparece na tela.

### H4 — Estoque integrado
**Arquivos:** `pages/Estoque.tsx`. **Serviço:** `produtosService`.
**Mapeamento:** `estoque` → `estoqueAtual`; `minimo` → `estoqueMinimo`; `custo` → `precoCusto`; `venda` → `precoVenda`; `status: string` → `StatusEstoque` **calculado pelo back** (remover a conta de `salvarProduto`); NCM cru.
**Fazer:**
- `listar({ busca })`; `estatisticas` fixas → `resumo()` (`totalProdutos`, `estoqueBaixo`, `valorEmEstoque`, `itensCriticos`).
- `salvarProduto` chama `atualizar(id, ProdutoInput)` e usa o produto devolvido (com o `status` do back).
- "Novo Produto" reutiliza `ModalEditarProduto` com `criar`; "Excluir" com confirmação.
**Aceite:** badge de status vem do back; indicadores refletem o banco; CRUD completo.

### H5 — PDV integrado  *(bloqueada: Q1, Q2)*
**Arquivos:** `pages/PDV.tsx`. **Serviços:** `produtosService`, `clientesService`, `vendasService`, `notasService`.
**Fazer:**
- **Buscar produto** (campo "Buscar produto…" e botão "Adicionar Produto"): `produtosService.listar({ busca })`, lista de resultados, adiciona ao carrinho. `ItemCarrinho` precisa passar a guardar `produtoId` (hoje só tem `codigo`); manter `editandoPreco`/`precoTemp` só na UI.
- **Cliente:** ligar os campos CPF/CNPJ e nome a estado (hoje soltos); busca por documento com `clientesService.listar({ documento })`; guardar `clienteId`. Não identificado (NFC-e) → `clienteId: null`.
- **Finalizar Venda:** `vendasService.criar({ …, status: "finalizada" })`. **Salvar Orçamento:** `status: "orcamento"`.
- **Payload `VendaInput`:** `tipoDocumento`, `modalidade`, `clienteId`, `metodoPagamento`, `bandeira` (**só** se crédito/débito, senão `null`), `destinoDinheiro` (**só** se dinheiro, senão `null`), `desconto`, `itens: [{ produtoId, quantidade, valorUnitario }]`.
- **Desconto:** limitar a `subtotal` (hoje pode gerar total negativo) — confirmar regra (Q2).
- **Imprimir Cupom (NFC-e):** baixar o PDF da nota gerada (`notasService.baixarPdf`) — depende de saber o id da nota (Q1).
- Após sucesso, limpar o carrinho e mostrar confirmação; tratar erro de estoque insuficiente.
**Aceite:** venda finalizada e orçamento salvos no back; NF-e exige documento do cliente; bandeira/destino só quando aplicável.

### H6 — Painel Fiscal integrado  *(bloqueada: Q3)*
**Arquivos:** `pages/PainelFiscal.tsx`. **Serviço:** `notasService`. **Depende de:** H1.
**Mapeamento:** `cliente` → `clienteNome`; `cnpj` → `clienteDocumento` (formatar); `valor` → `valorTotal`; `data` + `hora` → `emitidaEm` (ISO; usar `formatarData`/`formatarHora`); `status` agora é `StatusNota`.
**Fazer:**
- Lista com `listar({ status, de, ate })`; botão **Filtrar** abre filtros de status e período.
- **XML/PDF:** `baixarXml(id)`/`baixarPdf(id)` + `baixarArquivo`.
- **Enviar Lote ao Contador:** `enviarLoteContador()` com confirmação e feedback. **Exportar Relatório:** `relatorio(filtro)` + `baixarArquivo`.
- **Emitir NF-e:** navegar para `/pdv` já com NF-e selecionada (Q3).
- Estatísticas ("Emitidas Hoje", "Total do Dia", "Autorizadas", "Canceladas"): derivar da lista do dia ou contadores do back (Q5).
**Aceite:** lista real; downloads funcionam; indicadores coerentes com a lista.

### H7 — Cancelamento integrado
**Arquivos:** `pages/Cancelamento.tsx`. **Serviço:** `notasService`. **Depende de:** H1.
**Mapeamento:** `NotaParaCancelar` local → `NotaFiscal`; `cliente` → `clienteNome`; `dataEmissao` → `emitidaEm`; `chaveAcesso` igual; `valor` → `valorTotal`.
**Fazer:**
- Listar `listar({ status: "autorizada" })` e filtrar por tipo NF-e; busca por número/cliente continua local.
- `handleCancelar` → `cancelar(id, justificativa)`; remover o `setTimeout` de 1,2 s.
- Erros do back (prazo de 24 h vencido, nota já cancelada) exibidos com `error.message`; a tela **não** valida o prazo.
- Manter a validação local de justificativa ≥ 15 caracteres (`trim`).
**Aceite:** cancelamento chama o back; erro de prazo aparece; nota cancelada some da lista.

### H8 — Inutilização integrada
**Arquivos:** `pages/Inutilizacao.tsx`. **Serviço:** `inutilizacoesService`.
**Mapeamento do histórico:** `inicio`/`fim` → `numeroInicial`/`numeroFinal` (formatar com zeros à esquerda na exibição); `data` → `registradaEm` (ISO); `motivo` → `justificativa`; agora `numero*` é `number`.
**Fazer:**
- Histórico com `listar()`; `handleSubmit` → `criar({ serie, numeroInicial: Number(...), numeroFinal: Number(...), justificativa })`; remover o `setTimeout`.
- Usar o estado `erro` (hoje nunca preenchido) para mostrar `error.message`.
- Recarregar o histórico após sucesso.
**Aceite:** faixa inutilizada aparece no histórico; erro do back visível; validações locais mantidas (`final >= inicial`, justificativa ≥ 15).

### H9 — Nota de Devolução integrada  *(bloqueada: Q4)*
**Arquivos:** `pages/NotaDevolucao.tsx`. **Serviço:** `notasService`. **Depende de:** H1.
**Mapeamento:** `notasReferencia` local → `NotaFiscal`; `cnpj` → `clienteDocumento`; `data` → `emitidaEm`; `itensMock` → `NotaFiscalItem` de `notasService.itens(id)`; `qtdOriginal` = `quantidade` do item; `nome` = `descricao`.
**Fazer:**
- Listar notas autorizadas; ao selecionar, buscar os itens reais com `itens(id)` (remove `itensMock`, que era igual para qualquer nota).
- Manter limite `0 ≤ qtdDevolver ≤ qtdOriginal`.
- `handleEmitir` → `emitirDevolucao({ notaReferenciadaId, motivo, itens: [{ produtoId, quantidade, valorUnitario }] })` só com itens de `qtdDevolver > 0`; remover `setTimeout`.
- "Adicionar item" (sem handler hoje): decidir se existe (Q4).
**Aceite:** devolução emitida referenciando a nota original; erros do back visíveis.

### H10 — Nota de Entrada integrada
**Arquivos:** `pages/NotaEntrada.tsx`. **Serviço:** `notasService`. **Depende de:** H1.
**Mapeamento:** payload `EntradaInput` = `{ fornecedor: { cnpj, razaoSocial, ie, uf }, numero, serie, dataEmissao, dataEntrada, chaveAcesso, naturezaOperacao, itens }`; CNPJ só dígitos; datas já em ISO (`<input type="date">`); `itens` sem o `id` temporário (`Date.now()`); novos itens vão com `produtoId: null` até o back casar por `codigo`.
**Fazer:**
- **Importar XML** (input sem handler): `importarXmlEntrada(arquivo)` devolve `EntradaInput` para preencher fornecedor, nota e itens.
- `handleSalvar` → `registrarEntrada(payload)`; remover `setTimeout`. O back soma as quantidades ao estoque (o front só informa).
- Campo `ie` do fornecedor: adicionar o input (existe no estado, sem campo na tela).
- Botão "Cancelar": limpar o formulário.
**Aceite:** nota registrada e estoque atualizado no back; importação de XML preenche o formulário.

### H11 — Cards do Home integrados
**Arquivos:** `components/VendasCard.tsx`, `EstoqueCard.tsx`, `FiscalCard.tsx`. **Depende de:** H1.
- **EstoqueCard:** `produtosService.listar({ status })` para baixo/crítico (Q5: o back aceita um status por vez; buscar `baixo` e `critico` e juntar, ou pedir filtro múltiplo). `critico: boolean` → `status === "critico"`; `quantidade` → `estoqueAtual`; NCM formatado.
- **FiscalCard:** `notasService.listar({ de: hoje, ate: hoje })`; `valor` era **string** formatada → `formatarMoeda(valorTotal)`; `hora` de `emitidaEm`; XML/PDF e "Enviar lote para Contador" como em H6.
- **VendasCard:** buscar cliente por CNPJ (`clientesService.listar({ documento })`) e "Novo Pedido/Nota Fiscal" navega para `/pdv` (hoje sem ação).
**Aceite:** os três cards mostram dados reais e os botões agem.

### H12 — Remoção de mocks e limpeza final
- Apagar as constantes mock de cada tela (`clientesData`, `produtosIniciais`, `notasFiscais`, `notas`, `inutilizacoes`, `notasReferencia`, `itensMock`, listas dos cards) e as `estatisticas` fixas.
- Remover todos os `setTimeout` que simulam a SEFAZ.
- Conferir que nenhuma `interface` local duplica `types/`.
- Rodar `npm run typecheck` (H2) e `npx vite build`.
- Atualizar `MAPEAMENTO-CLASSES.md` (seções 3, 6 e 7 deixam de ser "estado original").

### H13 — Guard de rota por grupo de acesso  *(bloqueada: Q6, Q7)*
**Por quê:** hoje o `Layout` só checa "está logado". Qualquer usuário autenticado acessa todas as rotas (inclusive Fiscal, Cancelamento e Inutilização).
**Arquivos afetados:** `types/index.ts` (`Usuario`), `routes.ts`, `components/Layout.tsx`, `components/Sidebar.tsx`, `services/http.ts`; novos `config/acesso.ts`, `components/RotaProtegida.tsx`, `pages/AcessoNegado.tsx`. **Depende de:** H0.3.

**Desenho proposto** (a confirmar com Q6/Q7):
- `Usuario` ganha o grupo: `grupo: GrupoAcesso` (ou `grupos: GrupoAcesso[]` se o usuário puder ter vários). Vem de `POST /auth/login` e `GET /auth/me`. `GrupoAcesso` é um `type` union em `types/`, com os valores definidos por Q6.
- **Fonte única de verdade** em `src/app/config/acesso.ts`: mapa `rota → grupos permitidos`. Rota sem entrada = qualquer usuário autenticado. Exemplo de formato (valores reais dependem de Q6/Q7):
  ```ts
  export const ACESSO: Record<string, GrupoAcesso[]> = {
    "/estoque": ["admin", "estoquista"],
    "/cancelamento": ["admin", "fiscal"],
    // ...
  };
  ```
- `RotaProtegida` (wrapper de rota): lê `user.grupo` via `useAuth()`; sem permissão, redireciona para `/acesso-negado` (não para `/login`, pois o usuário está logado). É aplicada às rotas filhas em `routes.ts`, sem alterar as páginas.
- `Sidebar` usa o mesmo mapa e **esconde** os itens que o grupo não pode acessar (inclusive o submenu Fiscal inteiro se nenhum item for permitido).
- `pages/AcessoNegado.tsx`: mensagem clara e botão de voltar ao início (`/`).
- `services/http.ts`: resposta **403** vira `ApiError` com `status: 403`; as telas mostram `error.message` (diferente do 401, que desloga).
- A rota inicial `/` (Home) fica liberada a todos os grupos; se o grupo não tiver acesso ao PDV, o botão "Novo Pedido/Nota Fiscal" do `VendasCard` deve ser ocultado ou desabilitado (ver H11).

**Aviso de segurança:** o guard no front é só experiência de uso; qualquer um consegue alterar o JS. **O back precisa validar o grupo em cada endpoint** e responder 403. Esta história não substitui isso.

**Aceite:**
- Usuário de um grupo sem permissão que digita a URL direto vai para `/acesso-negado`.
- O menu lateral não mostra o que o grupo não acessa.
- Usuário com permissão navega normalmente; recarregar a página em uma rota permitida continua funcionando (o grupo vem de `/auth/me`, então o guard aguarda `carregando`).
- Um 403 do back aparece como mensagem na tela sem deslogar.

---

## Perguntas em aberto para o back

| ID | Pergunta | Bloqueia |
|---|---|---|
| Q1 | `POST /vendas` finalizada devolve o `id` da nota fiscal gerada (para imprimir cupom/baixar PDF)? A emissão é síncrona ou fica `processando`? | H5 |
| Q2 | Regra de desconto: limite máximo? Estoque insuficiente retorna qual erro? | H5 |
| Q3 | "Emitir NF-e" no Painel Fiscal: abre o PDV, ou há emissão avulsa (`POST /notas`)? | H6 |
| Q4 | Devolução permite adicionar item que não estava na nota original? O motivo é obrigatório? | H9 |
| Q5 | O back oferece contadores prontos (clientes por tipo, notas do dia) ou o front deriva da lista? Filtro de estoque aceita vários status? | H3, H6, H11 |
| Q6 | Quais são os grupos de acesso (nomes exatos, ex.: `admin`, `vendedor`, `estoquista`, `fiscal`)? Um usuário tem um grupo só ou vários? O back devolve o grupo em `/auth/login` e `/auth/me` (em qual campo)? | H13 |
| Q7 | Matriz de permissões: quais rotas cada grupo acessa (`/pdv`, `/clientes`, `/estoque`, `/fiscal`, `/cancelamento`, `/inutilizacao`, `/devolucao`, `/entrada`)? Além de ver a tela, algum grupo só pode *consultar* (sem criar/editar/excluir)? | H13 |

---

## Registro

| Data | Mudança |
|---|---|
| 2026-09-24 | Criados `docs/MAPEAMENTO-CLASSES.md`, tipos (`types/`), serviços (`services/`), `.env.example`; `AuthContext` assíncrono com token em `sessionStorage`; `Layout` e `Login` ajustados (H0.1–H0.4). `vite build` passou; TypeScript não verificado (sem `tsconfig`, ver H2). Login não testado contra um back real. |
| 2026-09-24 | Criado este arquivo de histórias. |
| 2026-09-24 | Adicionada H13 (guard de rota por grupo de acesso) e perguntas Q6/Q7. Só planejamento: nada implementado, aguardando a definição dos grupos e da matriz de permissões. |
