// Modelo de dados compartilhado com o back-end.
// Convenções: dinheiro em `number` (R$), datas em ISO 8601, documentos/telefones/NCM
// sem formatação. A formatação é responsabilidade da tela.

export type TipoPessoa = "PF" | "PJ";
export type TipoDocumento = "nfe" | "nfce";
export type Modalidade = "fisica" | "virtual";
export type MetodoPagamento = "dinheiro" | "credito" | "debito" | "pix" | "boleto";
export type BandeiraCartao = "mastercard" | "visa" | "elo" | "outros";
export type DestinoDinheiro = "banco" | "cofre";
export type StatusEstoque = "ok" | "atencao" | "baixo" | "critico";
export type StatusNota = "autorizada" | "cancelada" | "processando";
export type TipoNota = "NFE" | "NFCE" | "DEVOLUCAO" | "ENTRADA";
export type StatusVenda = "orcamento" | "finalizada";

/** Provisório: nomes de exemplo da H13 até a Q6 confirmar os grupos reais do back. */
export type GrupoAcesso = "admin" | "vendedor" | "estoquista" | "fiscal";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Cliente {
  id: number;
  tipo: TipoPessoa;
  documento: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  totalCompras: number;
  ultimaCompra: string | null;
}

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  ncm: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  precoCusto: number;
  precoVenda: number;
  status: StatusEstoque;
}

export interface Fornecedor {
  id: number;
  cnpj: string;
  razaoSocial: string;
  ie: string;
  uf: string;
}

export interface VendaItem {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
}

export interface Venda {
  id: number;
  tipoDocumento: TipoDocumento;
  modalidade: Modalidade;
  clienteId: number | null;
  metodoPagamento: MetodoPagamento;
  bandeira: BandeiraCartao | null;
  destinoDinheiro: DestinoDinheiro | null;
  desconto: number;
  subtotal: number;
  total: number;
  status: StatusVenda;
  itens: VendaItem[];
}

export interface NotaFiscalItem {
  produtoId: number | null;
  codigo: string;
  descricao: string;
  ncm: string;
  cfop: string | null;
  quantidade: number;
  valorUnitario: number;
}

export interface NotaFiscal {
  id: number;
  tipo: TipoNota;
  numero: string;
  serie: string;
  chaveAcesso: string | null;
  clienteId: number | null;
  clienteNome: string | null;
  clienteDocumento: string | null;
  fornecedorId: number | null;
  valorTotal: number;
  emitidaEm: string;
  status: StatusNota;
  vendaId: number | null;
  notaReferenciadaId: number | null;
}

export interface Inutilizacao {
  id: number;
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  justificativa: string;
  protocolo: string | null;
  registradaEm: string;
}

// ---- Payloads de entrada (o que o front envia) ----

export type ClienteInput = Omit<Cliente, "id" | "totalCompras" | "ultimaCompra">;
export type ProdutoInput = Omit<Produto, "id" | "status">;
export type VendaInput = Omit<Venda, "id" | "subtotal" | "total">;

export interface DevolucaoInput {
  notaReferenciadaId: number;
  motivo: string;
  itens: { produtoId: number; quantidade: number; valorUnitario: number }[];
}

export interface EntradaInput {
  fornecedor: Omit<Fornecedor, "id">;
  numero: string;
  serie: string;
  dataEmissao: string;
  dataEntrada: string;
  chaveAcesso: string;
  naturezaOperacao: string;
  itens: NotaFiscalItem[];
}

export interface InutilizacaoInput {
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  justificativa: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface ResumoEstoque {
  totalProdutos: number;
  estoqueBaixo: number;
  valorEmEstoque: number;
  itensCriticos: number;
}
