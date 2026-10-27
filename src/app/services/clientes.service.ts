import { Injectable } from '@angular/core';
import type { Pagina, Cliente, ClienteInput, TipoPessoa } from '../types';
import { request } from './http';

export interface FiltroClientes {
  tipo?: TipoPessoa;
  busca?: string;
  documento?: string;
  limit?: number;
  lastKey?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  listar(filtro: FiltroClientes = {}) {
    return request<Pagina<Cliente>>('/clientes', { query: { ...filtro } });
  }

  criar(dados: ClienteInput) {
    return request<Cliente>('/clientes', { method: 'POST', body: dados });
  }

  atualizar(id: string, dados: ClienteInput) {
    return request<Cliente>(`/clientes/${id}`, { method: 'PUT', body: dados });
  }

  excluir(id: string) {
    return request<void>(`/clientes/${id}`, { method: 'DELETE' });
  }
}
