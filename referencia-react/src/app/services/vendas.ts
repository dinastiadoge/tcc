import type { Venda, VendaInput } from "../types";
import { request } from "./http";

export const vendasService = {
  /** `status: "orcamento"` salva orçamento; `"finalizada"` finaliza a venda e emite o documento. */
  criar: (dados: VendaInput) =>
    request<Venda>("/vendas", { method: "POST", body: dados }),
};
