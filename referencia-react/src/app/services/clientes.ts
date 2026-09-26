import type { Cliente, ClienteInput, TipoPessoa } from "../types";
import { request } from "./http";

export interface FiltroClientes {
  tipo?: TipoPessoa;
  busca?: string;
  documento?: string;
}

export const clientesService = {
  listar: (filtro: FiltroClientes = {}) =>
    request<Cliente[]>("/clientes", { query: { ...filtro } }),

  criar: (dados: ClienteInput) =>
    request<Cliente>("/clientes", { method: "POST", body: dados }),

  atualizar: (id: number, dados: ClienteInput) =>
    request<Cliente>(`/clientes/${id}`, { method: "PUT", body: dados }),

  excluir: (id: number) => request<void>(`/clientes/${id}`, { method: "DELETE" }),
};
