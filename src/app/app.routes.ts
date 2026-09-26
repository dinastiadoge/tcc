import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Layout } from './layout/layout';
import { Cancelamento } from './pages/cancelamento';
import { Clientes } from './pages/clientes';
import { Estoque } from './pages/estoque';
import { Fornecedores } from './pages/fornecedores';
import { Home } from './pages/home';
import { Inutilizacao } from './pages/inutilizacao';
import { Login } from './pages/login';
import { NotaDevolucao } from './pages/nota-devolucao';
import { NotaEntrada } from './pages/nota-entrada';
import { PainelFiscal } from './pages/painel-fiscal';
import { PDV } from './pages/pdv';
import { Usuarios } from './pages/usuarios';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'pdv', component: PDV },
      { path: 'clientes', component: Clientes },
      { path: 'estoque', component: Estoque },
      { path: 'fornecedores', component: Fornecedores },
      { path: 'usuarios', component: Usuarios },
      { path: 'fiscal', component: PainelFiscal },
      { path: 'cancelamento', component: Cancelamento },
      { path: 'inutilizacao', component: Inutilizacao },
      { path: 'devolucao', component: NotaDevolucao },
      { path: 'entrada', component: NotaEntrada },
    ],
  },
];
