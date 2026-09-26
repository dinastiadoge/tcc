import { Injectable } from '@angular/core';
import type { Cliente, ClienteInput, TipoPessoa } from '../types';
import { request } from './http';

export interface FiltroClientes {
  tipo?: TipoPessoa;
  busca?: string;
  documento?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  listar(filtro: FiltroClientes = {}) {
    return request<Cliente[]>('/clientes', { query: { ...filtro } });
  }

  criar(dados: ClienteInput) {
    return request<Cliente>('/clientes', { method: 'POST', body: dados });
  }

  atualizar(id: number, dados: ClienteInput) {
    return request<Cliente>(`/clientes/${id}`, { method: 'PUT', body: dados });
  }

  excluir(id: number) {
    return request<void>(`/clientes/${id}`, { method: 'DELETE' });
  }
}
