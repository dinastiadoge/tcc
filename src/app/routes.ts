import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { PDV } from "./pages/PDV";
import { Clientes } from "./pages/Clientes";
import { Estoque } from "./pages/Estoque";
import { PainelFiscal } from "./pages/PainelFiscal";
import { Cancelamento } from "./pages/Cancelamento";
import { Inutilizacao } from "./pages/Inutilizacao";
import { NotaDevolucao } from "./pages/NotaDevolucao";
import { NotaEntrada } from "./pages/NotaEntrada";
import { Login } from "./pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "pdv", Component: PDV },
      { path: "clientes", Component: Clientes },
      { path: "estoque", Component: Estoque },
      { path: "fiscal", Component: PainelFiscal },
      { path: "cancelamento", Component: Cancelamento },
      { path: "inutilizacao", Component: Inutilizacao },
      { path: "devolucao", Component: NotaDevolucao },
      { path: "entrada", Component: NotaEntrada },
    ],
  },
]);
