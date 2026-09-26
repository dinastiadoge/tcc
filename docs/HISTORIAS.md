# Histórias de integração front ↔ back — WC Autopeças

Backlog vivo da integração. **Ao retomar o trabalho, leia só este arquivo**: cada história traz os arquivos, o serviço, o mapeamento de campos (antigo → novo) e os critérios de aceite, então não é preciso reler as telas para começar. Detalhes de modelo, regras e endpoints estão em [`MAPEAMENTO-CLASSES.md`](./MAPEAMENTO-CLASSES.md).

**Regra de manutenção:** ao concluir uma história, mude o status aqui e registre a data e decisões novas no fim do arquivo (seção "Registro").

Legenda: `Feito` · `Pendente` · `Bloqueada` (depende de decisão do back, ver "Perguntas em aberto").

> **Front em Angular (2026-09-26).** O front foi traduzido de React para Angular. Ao ler as histórias abaixo, troque os caminhos `.tsx` pelos equivalentes Angular: `pages/Clientes.tsx` → `pages/clientes.ts` + `clientes.html` (idem para as demais telas), `components/Layout|Sidebar|MobileHeader.tsx` → `layout/`, `components/*Card.tsx` → `cards/*-card.ts`, `context/AuthContext.tsx` → `core/auth.service.ts` + `core/auth.guard.ts`, `routes.ts` → `app.routes.ts`. Estado local (`useState`) virou `signal()`; serviços viraram classes `@Injectable` (`inject(ClientesService)`); `authService` da API chama-se `AuthApiService`. O código React original está em `referencia-react/`.

## Painel

| ID | História | Status |
|---|---|---|
| H0.1 | Tipos compartilhados | Feito |
| H0.2 | Cliente HTTP e serviços | Feito |
| H0.3 | Token em `sessionStorage` e auth assíncrono | Feito |
| H0.4 | Documentação de mapeamento de classes | Feito |
| H1 | Utilitários de formatação e download | Feito |
| H2 | Checagem de tipos (`tsconfig` + `tsc`) | Feito (coberta pelo Angular: `strict` + `strictTemplates` no `ng build`) |
| H0.5 | Tradução do front de React para Angular | Feito |
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
| H14 | Inventário e revisão dos formulários | Pendente |

Ordem sugerida: H1 → H2 → H3 → H4 → H7 → H8 → H10 → H5 → H6 → H9 → H11 → H13 → H12. (H13 pode subir na fila assim que Q6 e Q7 forem respondidas; ela só depende de H0.3.)

---

## Convenções (valem para todas as histórias)

- **Serviços** vêm de `src/app/services` e são injetados (ex.: `private readonly clientesService = inject(ClientesService)`, com `import { ClientesService } from '../services'`). Tipos vêm de `src/app/types`.
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
`src/app/services/http.ts` (`request`, `requestBlob`, `ApiError`, Bearer token, `environment.apiUrl`) e um serviço `@Injectable({ providedIn: 'root' })` por recurso:

| Serviço | Métodos |
|---|---|
| `AuthApiService` (era `authService`) | `login(email, senha)`, `me()` |
| `ClientesService` | `listar({tipo,busca,documento})`, `criar`, `atualizar(id,…)`, `excluir(id)` |
| `ProdutosService` | `listar({busca,status})`, `resumo()`, `criar`, `atualizar(id,…)`, `excluir(id)` |
| `VendasService` | `criar(VendaInput)` |
| `NotasService` | `listar({status,de,ate})`, `itens(id)`, `baixarXml(id)`, `baixarPdf(id)`, `relatorio(filtro)`, `enviarLoteContador()`, `cancelar(id,justificativa)`, `emitirDevolucao`, `registrarEntrada`, `importarXmlEntrada(File)` |
| `InutilizacoesService` | `listar()`, `criar(InutilizacaoInput)` |

A URL da API fica em `src/environments/environment.ts` (`apiUrl`, padrão `/api`) e `environment.development.ts` (`http://localhost:3000`). Não há mais `.env.example`/`VITE_API_URL`.

### H0.3 — Token em `sessionStorage` e auth assíncrono
- Token **só** em `sessionStorage["wc_token"]` (`services/tokenStorage.ts`), nunca `localStorage`.
- `AuthService` (`core/auth.service.ts`, era `AuthContext`): `login()` é `Promise<boolean>`; com token salvo, valida em `GET /auth/me` antes de renderizar (`carregando`); 401 limpa o token e desloga; remove o resíduo `localStorage["wc_user"]`.
- `authGuard` (`core/auth.guard.ts`) espera `carregando` e redireciona para `/login`; o `Layout` também volta ao login se a sessão cair. `Login` sem credencial fixa, sem e-mail pré-preenchido e sem atraso simulado.
- Contrato esperado: `POST /auth/login` → `{ token, usuario }`; `GET /auth/me` → `Usuario`; erros `{ message }`.
- Sem o back no ar o login falha.

### H0.4 — Documentação
`docs/MAPEAMENTO-CLASSES.md` (modelos, regras de negócio, endpoints, inconsistências) e este arquivo.

### H1 — Utilitários de formatação e download
`src/app/lib/format.ts`: `formatarDocumento` (11 dígitos → CPF, 14 → CNPJ), `formatarTelefone` (10/11 dígitos), `formatarNcm` (`87083010` → `8708.30.10`), `formatarMoeda` (`R$ 1.250,00`), `formatarData` (`dd/MM/yyyy`), `formatarHora` (`HH:mm`, horário local) e `formatarNumeroNota(n, tamanho = 6)` (zeros à esquerda, ex.: `000123`). Tamanhos fora do esperado voltam só com os dígitos; vazio/`null`/`undefined`/inválido voltam `""`. Data sem hora (`2026-09-24`) não passa por `Date`, para o fuso não voltar um dia.
`src/app/lib/download.ts`: `baixarArquivo(blob, nomeArquivo)` (`<a download>` temporário; libera a URL do objeto).
Ainda não há uso nas telas: entra em H3 em diante.

---

## Pendentes

### H2 — Checagem de tipos — **Feito (coberta pelo Angular)**
Com a tradução para Angular, `tsconfig.json` tem `strict` e `strictTemplates`, e o `ng build` checa tipos (inclusive dos templates). Não é preciso script `typecheck` separado.

### H3 — Clientes integrado
**Arquivos:** `pages/Clientes.tsx`. **Serviço:** `clientesService`.
**Mapeamento:** `status: "ativo"|"inativo"` → `ativo: boolean`; `documento` mascarado → cru (formatar na exibição); `ultimaCompra` `dd/MM/yyyy` → ISO ou `null`; `Cliente` local → `types/Cliente`.
**Fazer:**
- Carregar com `listar({ tipo, busca })` (filtro no back, com *debounce* de ~300 ms na busca). As estatísticas (total, PF, PJ, ativos) continuam derivadas da lista completa: buscar sem filtro ou usar contadores do back (Q5).
- "Novo Cliente" e "Editar": criar modal de formulário (não existe hoje; seguir o padrão de `ModalEditarProduto` em `Estoque.tsx`) com `ClienteInput`. "Excluir": confirmação + `excluir(id)`.
- **Campos do modal (ver H14):** `tipo` (PF/PJ) decide o rótulo ("CPF"/"CNPJ", "Nome"/"Razão Social") e a máscara; documento validado (dígitos verificadores, ver H14); e-mail, telefone e `ativo`. Erro por campo, não só mensagem geral.
- **Busca por documento:** o campo "Buscar por nome, documento ou email" já aceita CPF e CNPJ; garantir que a busca ignore a máscara (comparar só dígitos).
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
- **Regra do documento (H14):** NF-e exige CNPJ ou CPF (rótulo "CNPJ/CPF *"); NFC-e aceita só CPF opcional. Hoje o placeholder muda por tipo, mas a máscara e a validação não: aplicar máscara pelo número de dígitos (11 → CPF, 14 → CNPJ) e validar os dígitos verificadores antes de buscar. Cliente não encontrado: oferecer cadastro rápido (mesmo modal da H3) ou seguir só com nome digitado (Q8).
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
- **Filtrar (formulário que falta, H14):** o botão "Filtrar" hoje não abre nada. Campos: status (`StatusNota`, com "todos"), data inicial e data final (`de` ≤ `ate`); botão "Limpar". Reutilizar o mesmo formulário no relatório (`relatorio(filtro)`).
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
- **Validação (H14):** CNPJ do fornecedor com máscara e dígitos verificadores; `chaveAcesso` com 44 dígitos numéricos; `dataEntrada` ≥ `dataEmissao`; UF entre as 27 válidas. Os obrigatórios já têm `*` (CNPJ, razão social, número, emissão); passar a bloquear o salvar e mostrar o erro no campo.
- "Adicionar item" já tem botão: conferir o subformulário de item (código, descrição, NCM, quantidade, valor) quando a história começar.
- Botão "Cancelar": limpar o formulário.
**Aceite:** nota registrada e estoque atualizado no back; importação de XML preenche o formulário.

### H11 — Cards do Home integrados
**Arquivos:** `components/VendasCard.tsx`, `EstoqueCard.tsx`, `FiscalCard.tsx`. **Depende de:** H1.
- **EstoqueCard:** `produtosService.listar({ status })` para baixo/crítico (Q5: o back aceita um status por vez; buscar `baixo` e `critico` e juntar, ou pedir filtro múltiplo). `critico: boolean` → `status === "critico"`; `quantidade` → `estoqueAtual`; NCM formatado.
- **FiscalCard:** `notasService.listar({ de: hoje, ate: hoje })`; `valor` era **string** formatada → `formatarMoeda(valorTotal)`; `hora` de `emitidaEm`; XML/PDF e "Enviar lote para Contador" como em H6.
- **VendasCard:** buscar cliente por **CPF ou CNPJ** (`clientesService.listar({ documento })`) e "Novo Pedido/Nota Fiscal" navega para `/pdv` (hoje sem ação). **Correção (H14):** o campo hoje é só "Buscar Cliente por CNPJ" (`id="cnpj"`, placeholder `00.000.000/0000-00`); trocar por "Buscar Cliente por CPF ou CNPJ", com máscara automática (11 dígitos → `000.000.000-00`, 14 → `00.000.000/0000-00`) e validação dos dígitos. Ao achar o cliente, levar o `clienteId` ao PDV (parâmetro de rota) para não digitar de novo.
**Aceite:** os três cards mostram dados reais e os botões agem.

### H12 — Remoção de mocks e limpeza final
- Apagar as constantes mock de cada tela (`clientesData`, `produtosIniciais`, `notasFiscais`, `notas`, `inutilizacoes`, `notasReferencia`, `itensMock`, listas dos cards) e as `estatisticas` fixas.
- Remover todos os `setTimeout` que simulam a SEFAZ.
- Conferir que nenhuma `interface` local duplica `types/`.
- Rodar `npm run build` (o `ng build` já checa tipos, ver H2) e `npm test`.
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
- **Formulários de usuários (H14):** se o sistema tiver cadastro de usuários e grupos, ele é uma tela nova (nome, e-mail, senha, grupo, ativo). Depende de Q9; não entra na H13 até ser confirmado.
- `services/http.ts`: resposta **403** vira `ApiError` com `status: 403`; as telas mostram `error.message` (diferente do 401, que desloga).
- A rota inicial `/` (Home) fica liberada a todos os grupos; se o grupo não tiver acesso ao PDV, o botão "Novo Pedido/Nota Fiscal" do `VendasCard` deve ser ocultado ou desabilitado (ver H11).

**Aviso de segurança:** o guard no front é só experiência de uso; qualquer um consegue alterar o JS. **O back precisa validar o grupo em cada endpoint** e responder 403. Esta história não substitui isso.

**Aceite:**
- Usuário de um grupo sem permissão que digita a URL direto vai para `/acesso-negado`.
- O menu lateral não mostra o que o grupo não acessa.
- Usuário com permissão navega normalmente; recarregar a página em uma rota permitida continua funcionando (o grupo vem de `/auth/me`, então o guard aguarda `carregando`).
- Um 403 do back aparece como mensagem na tela sem deslogar.

### H14 — Inventário e revisão dos formulários
**Por quê:** ninguém tinha conferido se cada tela tem os campos que a regra de negócio pede. A revisão de 2026-09-26 achou lacunas (ex.: a busca de cliente na Home só aceitava CNPJ, e o PDV aceita CPF). Esta história é o **inventário de referência**: cada correção de campo vive na história da tela correspondente (coluna "Onde entra"), e este quadro deve ser atualizado quando uma delas terminar.
**Arquivos:** só leitura para o inventário; as correções tocam nas telas de cada história.

**Inventário por tela** (estado do código em 2026-09-26; "sem estado" = campo solto, sem `signal` ligado):

| Tela | Campos existentes | Lacunas encontradas | Onde entra |
|---|---|---|---|
| Login | e-mail, senha | Nenhuma de campo; mensagem de erro vem do back | H0.3 |
| Home · card Vendas | busca por **CNPJ** | **Falta CPF**; sem máscara nem validação; botão "Novo Pedido/Nota Fiscal" sem ação | H11 |
| Home · cards Estoque e Fiscal | nenhum (só botões) | Sem formulário; ações XML/PDF/lote dependem do back | H11 |
| PDV · cliente | CNPJ/CPF (NF-e) ou CPF opcional (NFC-e), nome/razão social | Sem estado; sem máscara por dígitos; sem validação; sem cadastro rápido | H5 |
| PDV · produtos e pagamento | busca de produto, desconto (R$), método, bandeira, destino do dinheiro | Desconto sem limite; busca e "Adicionar Produto" sem ação | H5 |
| Clientes | busca (nome, documento, e-mail) | **Não há formulário de cadastro/edição**; sem confirmação de exclusão | H3 |
| Estoque | busca; modal de produto (código, NCM, nome, estoque atual e mínimo, custo, venda) | Falta validar NCM (8 dígitos), preços ≥ 0 e código único; "Novo Produto" e exclusão sem confirmação | H4 |
| Painel Fiscal | nenhum campo | **"Filtrar" não abre formulário** (status, período); "Emitir NF-e" sem destino definido | H6 |
| Cancelamento | busca; justificativa | Validação de ≥ 15 caracteres já existe; o prazo de 24 h é do back | H7 |
| Inutilização | série, número inicial, número final, justificativa | Validações locais existem; falta usar `erro` do back | H8 |
| Nota de Devolução | busca de nota; quantidade por item; motivo | "Adicionar item" sem ação (Q4); motivo obrigatório? (Q4) | H9 |
| Nota de Entrada | importar XML; fornecedor (CNPJ, razão social, UF); número, série, natureza, emissão, entrada, chave de acesso; itens | **Falta o campo `ie`**; sem validação de CNPJ/chave; "Importar XML" sem handler | H10 |
| Fornecedor (cadastro) | — | Existe o tipo `Fornecedor` (`types/`), mas nenhuma tela; hoje o fornecedor só nasce dentro da nota de entrada (Q10) | novo, após Q10 |
| Usuários e grupos | — | Sem tela; depende de Q9 | H13 |

**Regras transversais de formulário** (aplicar em todas as telas acima, uma vez, num helper em `src/app/lib/`):
- **Documento:** 11 dígitos = CPF, 14 = CNPJ (mesma regra de `formatarDocumento`); máscara enquanto digita; validação dos dígitos verificadores; envia só dígitos ao back.
- **Erro por campo:** mensagem embaixo do campo e `aria-invalid`; campos obrigatórios com `*`; não bloquear o envio sem dizer por quê.
- **Estado:** todo campo ligado a `signal` ou formulário reativo (hoje há vários soltos, sobretudo no PDV e na Home).
- **Busca:** com *debounce* (~300 ms) e ignorando máscara ao comparar documento ou telefone.
- **Exclusões:** sempre com confirmação.

**Fazer:**
- Criar `src/app/lib/documento.ts` com `mascararDocumento`, `validarCpf`, `validarCnpj` e `tipoDocumentoPorDigitos`, com testes (`npm test`), antes de H3, H5, H10 e H11 usarem.
- Revisar este quadro contra o PDF do TCC (requisitos funcionais e Apêndice A) para achar telas ou campos que o projeto exige e ainda não existem. Ainda **não feito**: o PDF não foi relido nesta revisão.
- Conferir cada linha no navegador quando a história da tela começar (o inventário veio da leitura dos templates, não da tela rodando).
**Aceite:** todas as lacunas do quadro têm dono (história) ou pergunta em aberto; helper de documento com testes; quadro atualizado conforme as histórias avançam.

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
| Q8 | Cliente não encontrado na busca do PDV/Home: o front pode cadastrar na hora (`POST /clientes`) ou a venda segue só com o nome digitado? Para NFC-e com CPF que não está no cadastro, o CPF vai só na nota? | H5, H11 |
| Q9 | O sistema terá tela de cadastro de usuários e grupos, ou os usuários são criados só no back/banco? | H13, H14 |
| Q10 | Fornecedor precisa de cadastro próprio (CRUD) ou basta o que entra pela nota de entrada? | H14 |

---

## Registro

| Data | Mudança |
|---|---|
| 2026-09-24 | Criados `docs/MAPEAMENTO-CLASSES.md`, tipos (`types/`), serviços (`services/`), `.env.example`; `AuthContext` assíncrono com token em `sessionStorage`; `Layout` e `Login` ajustados (H0.1–H0.4). `vite build` passou; TypeScript não verificado (sem `tsconfig`, ver H2). Login não testado contra um back real. |
| 2026-09-24 | Criado este arquivo de histórias. |
| 2026-09-24 | Adicionada H13 (guard de rota por grupo de acesso) e perguntas Q6/Q7. Só planejamento: nada implementado, aguardando a definição dos grupos e da matriz de permissões. |
| 2026-09-26 | H1 feita: `src/app/lib/format.ts` e `download.ts` (funções puras, sem uso nas telas ainda). Verificado com asserções em Node; sem `tsc` (H2). `formatarNumeroNota` usa 6 dígitos por padrão, como nos mocks. |
| 2026-09-26 | Front traduzido de React para Angular 22 (standalone, signals, Tailwind 4, `lucide-angular`), mantendo rotas, mocks, login mock de dev e regras da H0.3 (token só em `sessionStorage`). Código React preservado em `referencia-react/`. `ng build` (com `strict` + `strictTemplates`) e `ng test` passam; capturas Angular × React em `docs/telas/`. H2 coberta pelo `strict`. Serviços viraram classes `@Injectable`; o `authService` da API virou `AuthApiService`; `.env.example`/`VITE_API_URL` saíram em favor de `src/environments/`. |
| 2026-09-26 | Revisão dos formulários: criada a H14 (inventário por tela e regras transversais). Lacunas registradas nas histórias H3, H5, H6, H10, H11 e H13; perguntas Q8–Q10. Achado principal: o card de vendas da Home só buscava por CNPJ (falta CPF; corrigir na H11). Levantamento feito pela leitura dos templates; falta conferir contra o PDF do TCC e no navegador. Nada implementado. |
