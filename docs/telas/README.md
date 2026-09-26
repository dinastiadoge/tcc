# Capturas das telas: Angular × React

Registro visual da tradução do front de React para Angular (2026-09-26). Cada tela foi capturada nos dois apps, com o mesmo navegador (Chrome headless), em **desktop (1280×900)** e **mobile (390×844)**, e comparada pixel a pixel (`pixelmatch`, limiar 0,1). O React é o código preservado em `referencia-react/`.

Para cada tela há três arquivos: `<tela>-<viewport>-angular.png`, `<tela>-<viewport>-react.png` e `<tela>-<viewport>-diff.png` (pixels diferentes em vermelho/amarelo, resto esmaecido).

**Resultado:** todas as telas ficaram com menos de 0,1% dos pixels diferentes. As diferenças que sobram são só o desenho de alguns ícones (o `lucide-angular` usa uma versão mais nova do lucide que o `lucide-react` original) e serrilhado de texto.

> Como as capturas exigem sessão, foram feitas com `sessionStorage["wc_token"] = "mock-token"` (login mock de desenvolvimento). Os dados são os mocks das telas.

| Tela | Rota | Diferença desktop | Diferença mobile |
|---|---|---|---|
| Login | `/login` | 0,00% | 0,00% |
| Início | `/` | 0,05% | 0,02% |
| PDV / Vendas | `/pdv` | 0,01% | 0,02% |
| Clientes | `/clientes` | 0,06% | 0,09% |
| Estoque | `/estoque` | 0,01% | 0,02% |
| Painel Fiscal | `/fiscal` | 0,01% | 0,02% |
| Cancelamento | `/cancelamento` | 0,00% | 0,02% |
| Inutilização | `/inutilizacao` | 0,00% | 0,02% |
| Nota de Devolução | `/devolucao` | 0,00% | 0,03% |
| Nota de Entrada | `/entrada` | 0,00% | 0,02% |

## Desktop

### Login (`/login`)

| Angular | React | Diff |
|---|---|---|
| ![Login Angular](login-desktop-angular.png) | ![Login React](login-desktop-react.png) | ![Login diff](login-desktop-diff.png) |

### Início (`/`)

| Angular | React | Diff |
|---|---|---|
| ![Início Angular](home-desktop-angular.png) | ![Início React](home-desktop-react.png) | ![Início diff](home-desktop-diff.png) |

### PDV / Vendas (`/pdv`)

| Angular | React | Diff |
|---|---|---|
| ![PDV / Vendas Angular](pdv-desktop-angular.png) | ![PDV / Vendas React](pdv-desktop-react.png) | ![PDV / Vendas diff](pdv-desktop-diff.png) |

### Clientes (`/clientes`)

| Angular | React | Diff |
|---|---|---|
| ![Clientes Angular](clientes-desktop-angular.png) | ![Clientes React](clientes-desktop-react.png) | ![Clientes diff](clientes-desktop-diff.png) |

### Estoque (`/estoque`)

| Angular | React | Diff |
|---|---|---|
| ![Estoque Angular](estoque-desktop-angular.png) | ![Estoque React](estoque-desktop-react.png) | ![Estoque diff](estoque-desktop-diff.png) |

### Painel Fiscal (`/fiscal`)

| Angular | React | Diff |
|---|---|---|
| ![Painel Fiscal Angular](fiscal-desktop-angular.png) | ![Painel Fiscal React](fiscal-desktop-react.png) | ![Painel Fiscal diff](fiscal-desktop-diff.png) |

### Cancelamento (`/cancelamento`)

| Angular | React | Diff |
|---|---|---|
| ![Cancelamento Angular](cancelamento-desktop-angular.png) | ![Cancelamento React](cancelamento-desktop-react.png) | ![Cancelamento diff](cancelamento-desktop-diff.png) |

### Inutilização (`/inutilizacao`)

| Angular | React | Diff |
|---|---|---|
| ![Inutilização Angular](inutilizacao-desktop-angular.png) | ![Inutilização React](inutilizacao-desktop-react.png) | ![Inutilização diff](inutilizacao-desktop-diff.png) |

### Nota de Devolução (`/devolucao`)

| Angular | React | Diff |
|---|---|---|
| ![Nota de Devolução Angular](devolucao-desktop-angular.png) | ![Nota de Devolução React](devolucao-desktop-react.png) | ![Nota de Devolução diff](devolucao-desktop-diff.png) |

### Nota de Entrada (`/entrada`)

| Angular | React | Diff |
|---|---|---|
| ![Nota de Entrada Angular](entrada-desktop-angular.png) | ![Nota de Entrada React](entrada-desktop-react.png) | ![Nota de Entrada diff](entrada-desktop-diff.png) |

## Mobile

### Login (`/login`)

| Angular | React | Diff |
|---|---|---|
| ![Login Angular](login-mobile-angular.png) | ![Login React](login-mobile-react.png) | ![Login diff](login-mobile-diff.png) |

### Início (`/`)

| Angular | React | Diff |
|---|---|---|
| ![Início Angular](home-mobile-angular.png) | ![Início React](home-mobile-react.png) | ![Início diff](home-mobile-diff.png) |

### PDV / Vendas (`/pdv`)

| Angular | React | Diff |
|---|---|---|
| ![PDV / Vendas Angular](pdv-mobile-angular.png) | ![PDV / Vendas React](pdv-mobile-react.png) | ![PDV / Vendas diff](pdv-mobile-diff.png) |

### Clientes (`/clientes`)

| Angular | React | Diff |
|---|---|---|
| ![Clientes Angular](clientes-mobile-angular.png) | ![Clientes React](clientes-mobile-react.png) | ![Clientes diff](clientes-mobile-diff.png) |

### Estoque (`/estoque`)

| Angular | React | Diff |
|---|---|---|
| ![Estoque Angular](estoque-mobile-angular.png) | ![Estoque React](estoque-mobile-react.png) | ![Estoque diff](estoque-mobile-diff.png) |

### Painel Fiscal (`/fiscal`)

| Angular | React | Diff |
|---|---|---|
| ![Painel Fiscal Angular](fiscal-mobile-angular.png) | ![Painel Fiscal React](fiscal-mobile-react.png) | ![Painel Fiscal diff](fiscal-mobile-diff.png) |

### Cancelamento (`/cancelamento`)

| Angular | React | Diff |
|---|---|---|
| ![Cancelamento Angular](cancelamento-mobile-angular.png) | ![Cancelamento React](cancelamento-mobile-react.png) | ![Cancelamento diff](cancelamento-mobile-diff.png) |

### Inutilização (`/inutilizacao`)

| Angular | React | Diff |
|---|---|---|
| ![Inutilização Angular](inutilizacao-mobile-angular.png) | ![Inutilização React](inutilizacao-mobile-react.png) | ![Inutilização diff](inutilizacao-mobile-diff.png) |

### Nota de Devolução (`/devolucao`)

| Angular | React | Diff |
|---|---|---|
| ![Nota de Devolução Angular](devolucao-mobile-angular.png) | ![Nota de Devolução React](devolucao-mobile-react.png) | ![Nota de Devolução diff](devolucao-mobile-diff.png) |

### Nota de Entrada (`/entrada`)

| Angular | React | Diff |
|---|---|---|
| ![Nota de Entrada Angular](entrada-mobile-angular.png) | ![Nota de Entrada React](entrada-mobile-react.png) | ![Nota de Entrada diff](entrada-mobile-diff.png) |
