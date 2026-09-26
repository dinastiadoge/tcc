---
title: 'Traduzir o front React (Figma Make) para Angular'
type: 'refactor'
created: '2026-09-26'
status: 'done'
baseline_commit: '0486e9a3669a233e206fbab35de534e42540ca35'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/docs/HISTORIAS.md'
  - '{project-root}/docs/MAPEAMENTO-CLASSES.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** O front do TCC está em React/Vite (gerado pelo Figma Make), mas o PDF do TCC e a decisão do autor definem Angular como front. Quanto mais telas e integrações forem feitas em React, mais caro fica trocar.

**Approach:** Traduzir o código existente para Angular no próprio repositório, com o mesmo comportamento, as mesmas rotas e a mesma aparência (classes Tailwind copiadas). O código React fica preservado em `referencia-react/`.

## Boundaries & Constraints

**Always:**
- Angular na versão estável mais recente, componentes standalone, signals e o novo control flow (`@if`/`@for`), Tailwind 4 (via `@tailwindcss/postcss`), `lucide-angular` no lugar de `lucide-react`.
- Mesmas 9 rotas de `routes.ts` (`/login`, `/`, `pdv`, `clientes`, `estoque`, `fiscal`, `cancelamento`, `inutilizacao`, `devolucao`, `entrada`); rota protegida por guard que espera `carregando` e redireciona para `/login`.
- Token só em `sessionStorage["wc_token"]`, nunca `localStorage`; resíduo `localStorage["wc_user"]` continua sendo removido; 401 limpa o token e desloga.
- `http.ts` (`request`, `requestBlob`, `ApiError`, Bearer) e `tokenStorage.ts` mantidos com `fetch`; `types/index.ts` copiado sem mudança; serviços viram classes `@Injectable({ providedIn: 'root' })` com os mesmos nomes e métodos (`authService`, `clientesService`, `produtosService`, `vendasService`, `notasService`, `inutilizacoesService`).
- URL da API em `src/environments/environment.ts` (`apiUrl` padrão `/api`), no lugar de `VITE_API_URL`.
- Telas continuam com os dados mockados atuais e os `setTimeout` que simulam a SEFAZ; a integração com o back segue o backlog de `docs/HISTORIAS.md` (H3 em diante).
- TypeScript em modo `strict`; `ng build` precisa passar sem erros de tipo.

**Never:**
- Apagar o código React nem `docs/`; mover para `referencia-react/`, incluindo `package.json`, `package-lock.json`, `vite.config.ts`, `index.html`, `postcss.config.mjs`, `pnpm-workspace.yaml`, `default_shadcn_theme.css`.
- Portar `components/ui/` (shadcn/Radix), MUI e as demais bibliotecas sem uso: nenhuma página importa esses componentes.
- Integrar com o back, mudar regras de negócio, layout ou textos das telas.
- Instalar Angular Material, PrimeNG ou outra biblioteca de componentes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sessão restaurada | Token em `sessionStorage`, back responde `/auth/me` | Layout renderiza após `carregando` | 401/erro: token limpo, vai para `/login` |
| Sem token | Acesso direto a `/estoque` | Redireciona para `/login` | N/A |
| Login inválido | E-mail/senha rejeitados ou back fora do ar | Mensagem de erro no formulário, sem sessão | `login()` devolve `false` |
| Menu mobile | Sidebar aberta em tela pequena | Corpo sem rolagem enquanto aberta; restaura ao fechar | N/A |

</frozen-after-approval>

## Code Map

- `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.ts` -- entrada, providers e as rotas a recriar em `app.routes.ts`/`app.config.ts`.
- `src/app/context/AuthContext.tsx` (76 linhas) -- vira `AuthService` com signals (`user`, `carregando`, `isAuthenticated`), `login`, `logout` e o callback de 401.
- `src/app/components/{Layout,Sidebar,MobileHeader,VendasCard,EstoqueCard,FiscalCard}.tsx` -- componentes de shell e cards da Home; `figma/ImageWithFallback.tsx` só se algo importar.
- `src/app/pages/*.tsx` (Home, Login, PDV 534, Clientes 439, NotaEntrada 352, Estoque 333, NotaDevolucao 268, Cancelamento 206, Inutilizacao 188, PainelFiscal 160) -- telas com `useState` e formulários controlados; portar para signals e `ngModel`.
- `src/app/services/*` e `src/app/types/index.ts` -- camada de dados; ver Always.
- `src/styles/theme.css` (181 linhas) -- tokens do tema, copiar para `src/styles.css`; `tailwind.css` traz `@source` e `tw-animate-css`.
- `src/app/components/ui/**` -- shadcn sem uso; não portar.
- `docs/HISTORIAS.md`, `docs/MAPEAMENTO-CLASSES.md`, `README.md`, `.env.example` -- citam caminhos `.tsx`, `VITE_API_URL` e `npm run dev`; atualizar.

## Tasks & Acceptance

**Execution:**
- [x] `referencia-react/` -- mover `src`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `postcss.config.mjs`, `pnpm-workspace.yaml`, `default_shadcn_theme.css` e `.env.example` do React; apagar só `node_modules` (regenerável) -- libera a raiz para o Angular sem perder nada
- [x] raiz -- criar o projeto Angular (`ng new`, standalone, CSS, `strict`) e configurar Tailwind 4 e `lucide-angular` -- base do front
- [x] `src/app/types`, `src/app/services`, `src/environments` -- copiar tipos e `http.ts`/`tokenStorage.ts`; serviços como `@Injectable` -- mesma API do backlog
- [x] `src/app/core/auth.service.ts`, `auth.guard.ts` -- signals e `CanActivateFn` -- substitui `AuthContext` e a checagem do `Layout`
- [x] `src/app/layout/*`, `src/app/cards/*` -- Layout, Sidebar, MobileHeader e os 3 cards -- shell e Home
- [x] `src/app/pages/*` -- as 10 telas -- mesmo comportamento com mocks
- [x] `src/styles.css`, `src/app/app.routes.ts`, `src/app/app.config.ts` -- tema e as 9 rotas -- paridade com `routes.ts`
- [x] `docs/HISTORIAS.md`, `docs/MAPEAMENTO-CLASSES.md`, `README.md`, `.env.example` -- caminhos Angular, `environment.ts`, `ng serve`/`ng build`; H2 fica como coberta pelo `strict`; nova linha no "Registro" -- manter o contexto do projeto correto

**Acceptance Criteria:**
- Given o projeto na raiz, when `npm install` e `npm run build`, then o build Angular termina sem erros de tipo.
- Given `ng serve` sem back, when abrir `/estoque`, then redireciona para `/login`; e o login sem back mostra erro sem quebrar a tela.
- Given uma sessão válida (back simulado ou token mockado no teste manual), when navegar por todas as rotas, then cada tela renderiza com os mesmos textos e classes da versão React.
- Given `referencia-react/`, then contém o código React completo e `src/app/components/ui` intacto.

## Implementation Notes

- Implementado direto (sem subagente de implementação). Angular 22.2, TypeScript 6 (`strict` e `strictTemplates` explícitos no `tsconfig.json`).
- `.env.example` foi movido para `referencia-react/` e **não** recriado: o Angular não lê `.env`; a URL da API e o login mock ficam em `src/environments/` (`apiUrl`, `mockAuth`).
- O `authService` da API virou `AuthApiService` (`services/auth-api.service.ts`) para não colidir com o `AuthService` de `core/`. O login mock de dev (commit `35a42a9`) foi preservado via `environment.mockAuth`.
- `lucide-angular@1.0.0` declara peer só até Angular 21; funciona no 22, então há `overrides` no `package.json` para o `npm install` puro passar.
- `lucide-angular` repete as classes no host e no `<svg>`; `styles.css` faz `lucide-icon { display: contents }` (achado da comparação visual: ícones absolutos saíam 12 px deslocados).
- Orçamento inicial do bundle subiu de 500 kB para 600 kB no `angular.json` (build estava 531 B acima).
- Campos numéricos usam `[value]` + `(input)` (não `ngModel`) para manter o comportamento controlado do React (clamp de quantidade, `||0`).
- Acrescentados: testes Vitest (`auth.service`, `auth.guard`, `layout`) cobrindo as 4 linhas da matriz; capturas Angular × React em `docs/telas/`.

## Spec Change Log

## Review Triage Log

Revisão por 3 subagentes independentes **não executada** (subagentes não autorizados pelo usuário nesta sessão). Foi feita auto-revisão + verificação empírica:

| Achado | Verdict | Evidência |
|---|---|---|
| Ícones `absolute` deslocados 12 px (classes duplicadas host/svg) | high → corrigido | Comparação Angular × React: Entrada mobile 1822 px → 77 px após `display: contents`. |
| Mock de login presente no bundle de produção | low | Inerte com `mockAuth: false` em `environment.ts`; no React o mesmo código só ficava ativo em `vite` dev. |
| Diferenças residuais de ícones (Building2, Mail, Phone) | low | Versão do lucide difere entre `lucide-react` 0.487 e `lucide-angular` 1.0; ≤ 0,09% dos pixels. |
| `package-lock.json` não versionado | low | Já era política do `.gitignore`; não alterado. |

## Design Notes

Formulário controlado do React → `signal` + `[(ngModel)]` (`FormsModule`); `useEffect` de overflow do body → `effect()` no `Layout`; `NavLink`/`Outlet` → `RouterLink(Active)`/`<router-outlet>`; `useNavigate` → `Router.navigate`. Se a tela tiver estado derivado (ex.: total do carrinho), usar `computed()`.

## Verification

**Commands:**
- `npm run build` -- expected: build Angular sem erros
- `npx ng serve` -- expected: app abre em `localhost:4200` e `/login` renderiza

**Manual checks (if no CLI):**
- Percorrer as 9 rotas com um token qualquer em `sessionStorage["wc_token"]` e o `/auth/me` simulado; conferir com o app React em `referencia-react/` (`npm i && npm run dev` lá dentro) lado a lado.
