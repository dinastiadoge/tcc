import { Injectable } from '@angular/core';
import type { Inutilizacao, InutilizacaoInput } from '../types';
import { request } from './http';

@Injectable({ providedIn: 'root' })
export class InutilizacoesService {
  listar() {
    return request<Inutilizacao[]>('/inutilizacoes');
  }

  criar(dados: InutilizacaoInput) {
    return request<Inutilizacao>('/inutilizacoes', { method: 'POST', body: dados });
  }
}
