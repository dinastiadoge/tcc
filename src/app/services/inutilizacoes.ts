import type { Inutilizacao, InutilizacaoInput } from "../types";
import { request } from "./http";

export const inutilizacoesService = {
  listar: () => request<Inutilizacao[]>("/inutilizacoes"),

  criar: (dados: InutilizacaoInput) =>
    request<Inutilizacao>("/inutilizacoes", { method: "POST", body: dados }),
};
