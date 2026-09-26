import type { Produto, ProdutoInput, ResumoEstoque, StatusEstoque } from "../types";
import { request } from "./http";

export interface FiltroProdutos {
  busca?: string;
  status?: StatusEstoque;
}

export const produtosService = {
  listar: (filtro: FiltroProdutos = {}) =>
    request<Produto[]>("/produtos", { query: { ...filtro } }),

  resumo: () => request<ResumoEstoque>("/produtos/resumo"),

  criar: (dados: ProdutoInput) =>
    request<Produto>("/produtos", { method: "POST", body: dados }),

  atualizar: (id: number, dados: ProdutoInput) =>
    request<Produto>(`/produtos/${id}`, { method: "PUT", body: dados }),

  excluir: (id: number) => request<void>(`/produtos/${id}`, { method: "DELETE" }),
};
