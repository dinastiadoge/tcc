import { Injectable } from '@angular/core';
import type { Venda, VendaInput } from '../types';
import { request } from './http';

@Injectable({ providedIn: 'root' })
export class VendasService {
  /** `status: "orcamento"` salva orçamento; `"finalizada"` finaliza a venda e emite o documento. */
  criar(dados: VendaInput) {
    return request<Venda>('/vendas', { method: 'POST', body: dados });
  }
}
