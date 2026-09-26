import type {
  DevolucaoInput,
  EntradaInput,
  NotaFiscal,
  NotaFiscalItem,
  StatusNota,
} from "../types";
import { request, requestBlob } from "./http";

export interface FiltroNotas {
  status?: StatusNota;
  de?: string; // ISO yyyy-MM-dd
  ate?: string; // ISO yyyy-MM-dd
}

export const notasService = {
  listar: (filtro: FiltroNotas = {}) =>
    request<NotaFiscal[]>("/notas", { query: { ...filtro } }),

  itens: (id: number) => request<NotaFiscalItem[]>(`/notas/${id}/itens`),

  baixarXml: (id: number) => requestBlob(`/notas/${id}/xml`),
  baixarPdf: (id: number) => requestBlob(`/notas/${id}/pdf`),
  relatorio: (filtro: FiltroNotas = {}) =>
    requestBlob("/notas/relatorio", { query: { ...filtro } }),

  enviarLoteContador: () =>
    request<void>("/notas/lote-contador", { method: "POST" }),

  /** O back valida o prazo de 24 h e a justificativa (mín. 15 caracteres). */
  cancelar: (id: number, justificativa: string) =>
    request<NotaFiscal>(`/notas/${id}/cancelamento`, {
      method: "POST",
      body: { justificativa },
    }),

  emitirDevolucao: (dados: DevolucaoInput) =>
    request<NotaFiscal>("/notas/devolucao", { method: "POST", body: dados }),

  registrarEntrada: (dados: EntradaInput) =>
    request<NotaFiscal>("/notas/entrada", { method: "POST", body: dados }),

  /** Envia o XML da NF-e; o back devolve os dados para preencher o formulário de entrada. */
  importarXmlEntrada: (arquivo: File) => {
    const form = new FormData();
    form.append("arquivo", arquivo);
    return request<EntradaInput>("/notas/entrada/importar-xml", {
      method: "POST",
      body: form,
    });
  },
};
