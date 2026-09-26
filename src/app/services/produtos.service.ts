import { Injectable } from '@angular/core';
import type { Produto, ProdutoInput, ResumoEstoque, StatusEstoque } from '../types';
import { request } from './http';

export interface FiltroProdutos {
  busca?: string;
  status?: StatusEstoque;
}

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  listar(filtro: FiltroProdutos = {}) {
    return request<Produto[]>('/produtos', { query: { ...filtro } });
  }

  resumo() {
    return request<ResumoEstoque>('/produtos/resumo');
  }

  criar(dados: ProdutoInput) {
    return request<Produto>('/produtos', { method: 'POST', body: dados });
  }

  atualizar(id: number, dados: ProdutoInput) {
    return request<Produto>(`/produtos/${id}`, { method: 'PUT', body: dados });
  }

  excluir(id: number) {
    return request<void>(`/produtos/${id}`, { method: 'DELETE' });
  }
}
