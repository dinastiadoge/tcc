import { Injectable } from '@angular/core';
import type {
  DevolucaoInput,
  EntradaInput,
  NotaFiscal,
  NotaFiscalItem,
  StatusNota,
} from '../types';
import { request, requestBlob } from './http';

export interface FiltroNotas {
  status?: StatusNota;
  de?: string; // ISO yyyy-MM-dd
  ate?: string; // ISO yyyy-MM-dd
}

@Injectable({ providedIn: 'root' })
export class NotasService {
  listar(filtro: FiltroNotas = {}) {
    return request<NotaFiscal[]>('/notas', { query: { ...filtro } });
  }

  itens(id: number) {
    return request<NotaFiscalItem[]>(`/notas/${id}/itens`);
  }

  baixarXml(id: number) {
    return requestBlob(`/notas/${id}/xml`);
  }

  baixarPdf(id: number) {
    return requestBlob(`/notas/${id}/pdf`);
  }

  relatorio(filtro: FiltroNotas = {}) {
    return requestBlob('/notas/relatorio', { query: { ...filtro } });
  }

  enviarLoteContador() {
    return request<void>('/notas/lote-contador', { method: 'POST' });
  }

  /** O back valida o prazo de 24 h e a justificativa (mín. 15 caracteres). */
  cancelar(id: number, justificativa: string) {
    return request<NotaFiscal>(`/notas/${id}/cancelamento`, {
      method: 'POST',
      body: { justificativa },
    });
  }

  emitirDevolucao(dados: DevolucaoInput) {
    return request<NotaFiscal>('/notas/devolucao', { method: 'POST', body: dados });
  }

  registrarEntrada(dados: EntradaInput) {
    return request<NotaFiscal>('/notas/entrada', { method: 'POST', body: dados });
  }

  /** Envia o XML da NF-e; o back devolve os dados para preencher o formulário de entrada. */
  importarXmlEntrada(arquivo: File) {
    const form = new FormData();
    form.append('arquivo', arquivo);
    return request<EntradaInput>('/notas/entrada/importar-xml', {
      method: 'POST',
      body: form,
    });
  }
}
