import {
  Search,
  Plus,
  Trash2,
  ShoppingCart,
  DollarSign,
  User,
  UserX,
  Printer,
  CreditCard,
  Banknote,
  Building,
  Vault,
  Edit3,
  Check,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { clientesService, notasService, produtosService, vendasService } from "../services";
import type {
  BandeiraCartao,
  Cliente,
  DestinoDinheiro,
  MetodoPagamento,
  Modalidade,
  NotaFiscal,
  Produto,
  TipoDocumento,
} from "../types";
import { useApi, useIntervalo } from "../lib/useApi";
import { baixarArquivo, dinheiro, mensagemErro, somenteDigitos } from "../lib/formato";
import { StatusNotaBadge } from "../components/StatusNotaBadge";

interface ItemCarrinho {
  id: number; // produtoId
  codigo: string;
  nome: string;
  quantidade: number;
  disponivel: number;
  valorUnitario: number;
  editandoPreco: boolean;
  precoTemp: string;
}

type DestinoMoeda = DestinoDinheiro;

const BANDEIRAS: { value: BandeiraCartao; label: string }[] = [
  { value: "mastercard", label: "Mastercard" },
  { value: "visa", label: "Visa" },
  { value: "elo", label: "Elo" },
  { value: "outros", label: "Outros" },
];

/** Venda finalizada e a nota que o back está emitindo para ela. */
interface Emissao {
  vendaId: number;
  total: number;
  nota: NotaFiscal | null;
}

export function PDV() {
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>("nfe");
  const [consumidorIdentificado, setConsumidorIdentificado] = useState(true);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const [modalidade, setModalidade] = useState<Modalidade>("fisica");
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("dinheiro");
  const [bandeira, setBandeira] = useState<BandeiraCartao>("visa");
  const [destinoMoeda, setDestinoMoeda] = useState<DestinoMoeda>("banco");
  const [desconto, setDesconto] = useState(0);

  // Cliente
  const [docCliente, setDocCliente] = useState("");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [buscandoCliente, setBuscandoCliente] = useState(false);
  const [clienteNaoEncontrado, setClienteNaoEncontrado] = useState(false);

  // Produtos
  const produtos = useApi(() => produtosService.listar(), []);
  const [buscaProduto, setBuscaProduto] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  const [enviando, setEnviando] = useState<"finalizada" | "orcamento" | null>(null);
  const [erroVenda, setErroVenda] = useState<string | null>(null);
  const [emissao, setEmissao] = useState<Emissao | null>(null);

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.quantidade * item.valorUnitario,
    0,
  );
  const total = subtotal - desconto;

  const sugestoes = useMemo(() => {
    const termo = buscaProduto.trim().toLowerCase();
    if (!termo) return [];
    return (produtos.dados ?? [])
      .filter((p) => p.codigo.toLowerCase().includes(termo) || p.nome.toLowerCase().includes(termo))
      .slice(0, 8);
  }, [buscaProduto, produtos.dados]);

  const adicionarProduto = (p: Produto) => {
    setCarrinho((atual) => {
      const existente = atual.find((i) => i.id === p.id);
      if (existente) {
        return atual.map((i) => (i.id === p.id ? { ...i, quantidade: i.quantidade + 1 } : i));
      }
      return [
        ...atual,
        {
          id: p.id,
          codigo: p.codigo,
          nome: p.nome,
          quantidade: 1,
          disponivel: p.estoqueAtual,
          valorUnitario: p.precoVenda,
          editandoPreco: false,
          precoTemp: p.precoVenda.toFixed(2),
        },
      ];
    });
    setBuscaProduto("");
    setMostrarSugestoes(false);
  };

  const buscarCliente = async () => {
    const doc = somenteDigitos(docCliente);
    setCliente(null);
    setClienteNaoEncontrado(false);
    if (doc.length !== 11 && doc.length !== 14) return;
    setBuscandoCliente(true);
    try {
      const lista = await clientesService.listar({ documento: doc });
      if (lista.length > 0) setCliente(lista[0]);
      else setClienteNaoEncontrado(true);
    } catch (e) {
      toast.error(mensagemErro(e));
    } finally {
      setBuscandoCliente(false);
    }
  };

  const removerItem = (id: number) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const atualizarQuantidade = (id: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    setCarrinho(
      carrinho.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item,
      ),
    );
  };

  const iniciarEdicaoPreco = (id: number) => {
    setCarrinho(
      carrinho.map((item) =>
        item.id === id
          ? { ...item, editandoPreco: true, precoTemp: item.valorUnitario.toFixed(2) }
          : item,
      ),
    );
  };

  const confirmarEdicaoPreco = (id: number) => {
    setCarrinho(
      carrinho.map((item) => {
        if (item.id !== id) return item;
        const novoValor = parseFloat(item.precoTemp.replace(",", ".")) || item.valorUnitario;
        return { ...item, valorUnitario: novoValor, editandoPreco: false };
      }),
    );
  };

  const cancelarEdicaoPreco = (id: number) => {
    setCarrinho(
      carrinho.map((item) =>
        item.id === id
          ? { ...item, editandoPreco: false, precoTemp: item.valorUnitario.toFixed(2) }
          : item,
      ),
    );
  };

  const usaCartao = metodoPagamento === "credito" || metodoPagamento === "debito";
  const exigeCliente = tipoDocumento === "nfe";
  const clienteId = consumidorIdentificado ? cliente?.id ?? null : null;
  const podeEnviar = carrinho.length > 0 && total >= 0 && (!exigeCliente || clienteId !== null);
  const semEndereco = cliente !== null && !cliente.logradouro;

  const enviar = async (status: "finalizada" | "orcamento") => {
    setEnviando(status);
    setErroVenda(null);
    try {
      const venda = await vendasService.criar({
        tipoDocumento,
        modalidade,
        clienteId,
        metodoPagamento,
        bandeira: usaCartao ? bandeira : null,
        destinoDinheiro: metodoPagamento === "dinheiro" ? destinoMoeda : null,
        desconto,
        status,
        itens: carrinho.map((i) => ({ produtoId: i.id, quantidade: i.quantidade, valorUnitario: i.valorUnitario })),
      });
      if (status === "orcamento") {
        toast.success(`Orçamento ${venda.id} salvo.`);
        return;
      }
      setEmissao({ vendaId: venda.id, total: venda.total, nota: null });
      produtos.recarregar();
    } catch (e) {
      setErroVenda(mensagemErro(e));
    } finally {
      setEnviando(null);
    }
  };

  // A nota é emitida de forma assíncrona: consulta até sair de "processando".
  const consultarNota = async () => {
    if (!emissao) return;
    try {
      const notas = await notasService.listar({ vendaId: emissao.vendaId });
      if (notas.length > 0) setEmissao((e) => (e ? { ...e, nota: notas[0] } : e));
    } catch {
      // tenta de novo no próximo ciclo
    }
  };
  useIntervalo(consultarNota, 1500, emissao !== null && (emissao.nota === null || emissao.nota.status === "processando"));

  const novaVenda = () => {
    setEmissao(null);
    setCarrinho([]);
    setDesconto(0);
    setDocCliente("");
    setCliente(null);
    setClienteNaoEncontrado(false);
    setErroVenda(null);
  };

  const baixarNota = async (nota: NotaFiscal, formato: "xml" | "pdf") => {
    try {
      const blob = formato === "xml" ? await notasService.baixarXml(nota.id) : await notasService.baixarPdf(nota.id);
      if (formato === "pdf" && nota.tipo === "NFCE") {
        window.open(URL.createObjectURL(blob), "_blank"); // cupom: abre para imprimir
      } else {
        baixarArquivo(blob, `${nota.tipo}-${nota.numero}.${formato}`);
      }
    } catch (e) {
      toast.error(mensagemErro(e));
    }
  };

  const reenviarNota = async (nota: NotaFiscal) => {
    try {
      const atualizada = await notasService.reenviar(nota.id);
      setEmissao((e) => (e ? { ...e, nota: atualizada } : e));
      toast.success("Nota reenviada para a SEFAZ.");
    } catch (e) {
      toast.error(mensagemErro(e));
    }
  };

  if (emissao) {
    return (
      <ResultadoEmissao
        emissao={emissao}
        clienteId={clienteId}
        onBaixar={baixarNota}
        onReenviar={reenviarNota}
        onNovaVenda={novaVenda}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Vendas / PDV</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Emissão rápida de notas fiscais e cupons
        </p>
      </div>

      {/* Tipo de documento + Modalidade */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-200 mb-4 sm:mb-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="flex-1">
            <h2 className="text-sm text-gray-500 mb-3">Tipo de documento</h2>
            <div className="flex gap-3">
              <button
                onClick={() => { setTipoDocumento("nfe"); setConsumidorIdentificado(true); }}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  tipoDocumento === "nfe"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                NF-e (Nota Fiscal)
              </button>
              <button
                onClick={() => { setTipoDocumento("nfce"); setConsumidorIdentificado(false); }}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  tipoDocumento === "nfce"
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                NFC-e (Cupom Fiscal)
              </button>
            </div>
          </div>

          <div className="sm:border-l sm:border-gray-200 sm:pl-5">
            <h2 className="text-sm text-gray-500 mb-3">Modalidade</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setModalidade("fisica")}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  modalidade === "fisica"
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>🏪</span>
                Física
              </button>
              <button
                onClick={() => setModalidade("virtual")}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  modalidade === "virtual"
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>🌐</span>
                Virtual
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Seção do cliente */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg text-gray-900">Cliente</h2>
              {tipoDocumento === "nfce" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConsumidorIdentificado(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      !consumidorIdentificado
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <UserX size={14} />
                    Não identificado
                  </button>
                  <button
                    onClick={() => setConsumidorIdentificado(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      consumidorIdentificado
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User size={14} />
                    Identificar
                  </button>
                </div>
              )}
            </div>

            {!consumidorIdentificado ? (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <UserX size={20} className="text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">Consumidor não identificado</p>
                  <p className="text-xs text-orange-600">CPF/CNPJ não será exigido no cupom fiscal</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                    {tipoDocumento === "nfe" ? "CNPJ/CPF *" : "CPF (opcional)"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={docCliente}
                      onChange={(e) => {
                        setDocCliente(e.target.value);
                        setCliente(null);
                        setClienteNaoEncontrado(false);
                      }}
                      onBlur={buscarCliente}
                      onKeyDown={(e) => e.key === "Enter" && buscarCliente()}
                      placeholder={tipoDocumento === "nfe" ? "00.000.000/0000-00" : "000.000.000-00"}
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {buscandoCliente ? (
                      <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={16} />
                    ) : (
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                    Nome / Razão Social
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={cliente?.nome ?? ""}
                    placeholder="Preenchido pelo documento"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 outline-none"
                  />
                </div>
                {cliente && (
                  <div className="md:col-span-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      <MapPin size={12} />
                      {cliente.logradouro
                        ? `${cliente.logradouro}, ${cliente.numero} - ${cliente.bairro} - ${cliente.cidade}/${cliente.uf}`
                        : `${cliente.cidade}/${cliente.uf}`}
                    </span>
                    {semEndereco ? (
                      <Link
                        to={`/clientes?editar=${cliente.id}&foco=endereco`}
                        className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 hover:bg-orange-200"
                      >
                        Endereço incompleto · completar cadastro
                      </Link>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">Endereço completo</span>
                    )}
                    {!cliente.ativo && <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">Cliente inativo</span>}
                  </div>
                )}
                {clienteNaoEncontrado && (
                  <div className="md:col-span-2 text-xs text-orange-700">
                    Nenhum cliente com esse documento.{" "}
                    <Link to="/clientes" className="underline">
                      Cadastrar cliente
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg text-gray-900">Produtos</h2>
              <button
                onClick={() => sugestoes[0] && adicionarProduto(sugestoes[0])}
                disabled={sugestoes.length === 0}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors text-sm"
              >
                <Plus size={16} />
                <span>Adicionar Produto</span>
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={buscaProduto}
                  onChange={(e) => {
                    setBuscaProduto(e.target.value);
                    setMostrarSugestoes(true);
                  }}
                  onFocus={() => setMostrarSugestoes(true)}
                  onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
                  onKeyDown={(e) => e.key === "Enter" && sugestoes[0] && adicionarProduto(sugestoes[0])}
                  placeholder="Buscar produto por código ou nome..."
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                {mostrarSugestoes && sugestoes.length > 0 && (
                  <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                    {sugestoes.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => adicionarProduto(p)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-blue-50"
                        >
                          <span>
                            <span className="text-xs text-gray-500 mr-2">{p.codigo}</span>
                            {p.nome}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {dinheiro(p.precoVenda)} · {p.estoqueAtual} em estoque
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-3 text-xs text-gray-500">Código</th>
                    <th className="text-left py-3 px-2 sm:px-3 text-xs text-gray-500">Produto</th>
                    <th className="text-center py-3 px-2 sm:px-3 text-xs text-gray-500">Qtd</th>
                    <th className="text-right py-3 px-2 sm:px-3 text-xs text-gray-500">Valor Unit.</th>
                    <th className="text-right py-3 px-2 sm:px-3 text-xs text-gray-500">Total</th>
                    <th className="py-3 px-2 sm:px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {carrinho.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 sm:px-3 text-xs text-gray-500">{item.codigo}</td>
                      <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                        {item.nome}
                        {item.quantidade > item.disponivel && (
                          <span className="block text-xs text-red-600">Só {item.disponivel} em estoque</span>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-center">
                        <input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) =>
                            atualizarQuantidade(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-xs sm:text-sm text-center border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-right">
                        {item.editandoPreco ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-gray-500">R$</span>
                            <input
                              type="text"
                              value={item.precoTemp}
                              onChange={(e) =>
                                setCarrinho(
                                  carrinho.map((c) =>
                                    c.id === item.id ? { ...c, precoTemp: e.target.value } : c,
                                  ),
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") confirmarEdicaoPreco(item.id);
                                if (e.key === "Escape") cancelarEdicaoPreco(item.id);
                              }}
                              autoFocus
                              className="w-20 px-1 py-0.5 text-xs text-right border border-blue-400 rounded outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => confirmarEdicaoPreco(item.id)}
                              className="p-0.5 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => cancelarEdicaoPreco(item.id)}
                              className="p-0.5 text-red-500 hover:bg-red-50 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarEdicaoPreco(item.id)}
                            className="flex items-center justify-end gap-1 group ml-auto"
                            title="Clique para editar o preço"
                          >
                            <span className="text-xs sm:text-sm text-gray-900">
                              {dinheiro(item.valorUnitario)}
                            </span>
                            <Edit3
                              size={12}
                              className="text-gray-300 group-hover:text-blue-500 transition-colors"
                            />
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                        {dinheiro(item.quantidade * item.valorUnitario)}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-center">
                        <button
                          onClick={() => removerItem(item.id)}
                          className="p-1 sm:p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {carrinho.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                        Nenhum produto adicionado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Painel lateral do resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 lg:sticky lg:top-8 space-y-5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-blue-600" size={20} />
              <h2 className="text-base sm:text-lg text-gray-900">Resumo do Pedido</h2>
            </div>

            {/* Totais */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{dinheiro(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 items-center">
                <span>Desconto (R$)</span>
                <input
                  type="number"
                  value={desconto}
                  onChange={(e) => setDesconto(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 px-2 py-0.5 text-sm text-right border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-lg text-gray-900 font-semibold">
                <span>Total</span>
                <span>{dinheiro(total)}</span>
              </div>
            </div>

            {/* Forma de pagamento */}
            <div>
              <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Forma de Pagamento</h3>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: "dinheiro", label: "Dinheiro", Icon: Banknote },
                  { value: "credito", label: "Crédito", Icon: CreditCard },
                  { value: "debito", label: "Débito", Icon: CreditCard },
                  { value: "pix", label: "PIX", Icon: DollarSign },
                  { value: "boleto", label: "Boleto", Icon: FileIcon },
                ] as const).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setMetodoPagamento(value)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors ${
                      metodoPagamento === value
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={13} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Bandeira do cartão */}
              {usaCartao && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1.5">Bandeira</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BANDEIRAS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setBandeira(value)}
                        className={`px-2 py-1.5 rounded text-xs border transition-colors ${
                          bandeira === value
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Destino do dinheiro */}
            {metodoPagamento === "dinheiro" && (
              <div>
                <h3 className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Destino do Dinheiro</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDestinoMoeda("banco")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors ${
                      destinoMoeda === "banco"
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Building size={13} />
                    Banco
                  </button>
                  <button
                    onClick={() => setDestinoMoeda("cofre")}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors ${
                      destinoMoeda === "cofre"
                        ? "bg-amber-600 border-amber-600 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Vault size={13} />
                    Cofre
                  </button>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="space-y-2 pt-1">
              {erroVenda && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{erroVenda}</div>
              )}
              {exigeCliente && clienteId === null && carrinho.length > 0 && (
                <p className="text-xs text-orange-700">NF-e exige cliente identificado: informe o CPF/CNPJ.</p>
              )}
              <button
                onClick={() => enviar("finalizada")}
                disabled={!podeEnviar || enviando !== null}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
              >
                {enviando === "finalizada" ? <Loader2 size={17} className="animate-spin" /> : <DollarSign size={17} />}
                Finalizar Venda
              </button>

              {tipoDocumento === "nfce" && (
                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                  <Printer size={12} />
                  O cupom fica disponível para impressão após a autorização.
                </p>
              )}

              <button
                onClick={() => enviar("orcamento")}
                disabled={carrinho.length === 0 || enviando !== null}
                className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ResultadoEmissao({
  emissao,
  clienteId,
  onBaixar,
  onReenviar,
  onNovaVenda,
}: {
  emissao: Emissao;
  clienteId: number | null;
  onBaixar: (n: NotaFiscal, formato: "xml" | "pdf") => void;
  onReenviar: (n: NotaFiscal) => void;
  onNovaVenda: () => void;
}) {
  const nota = emissao.nota;
  const status = nota?.status ?? "processando";
  const nome = nota?.tipo === "NFCE" ? "NFC-e" : "NF-e";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
        {status === "processando" && (
          <>
            <Loader2 className="mx-auto mb-4 text-blue-600 animate-spin" size={40} />
            <h2 className="text-lg text-gray-900 mb-1">Venda {emissao.vendaId} finalizada</h2>
            <p className="text-sm text-gray-500">Emitindo o documento fiscal e aguardando a SEFAZ...</p>
          </>
        )}
        {status === "autorizada" && nota && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-lg text-gray-900 mb-1">
              {nome} {nota.numero}/{nota.serie} autorizada
            </h2>
            <p className="text-sm text-gray-500 mb-1">Venda {emissao.vendaId} · {dinheiro(emissao.total)}</p>
            {nota.chaveAcesso && <p className="text-xs text-gray-400 font-mono break-all mb-5">{nota.chaveAcesso}</p>}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => onBaixar(nota, "pdf")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {nota.tipo === "NFCE" ? <Printer size={15} /> : <FileText size={15} />}
                {nota.tipo === "NFCE" ? "Imprimir Cupom" : "Baixar DANFE"}
              </button>
              <button
                onClick={() => onBaixar(nota, "xml")}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Download size={15} />
                Baixar XML
              </button>
            </div>
          </>
        )}
        {status === "rejeitada" && nota && (
          <>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-orange-600" size={32} />
            </div>
            <h2 className="text-lg text-gray-900 mb-1">
              {nome} {nota.numero} rejeitada pela SEFAZ
            </h2>
            <p className="text-sm text-orange-700 mb-5">{nota.motivoRejeicao ?? "Sem motivo informado"}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {clienteId !== null && (
                <Link
                  to={`/clientes?editar=${clienteId}&foco=endereco`}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Corrigir cadastro do cliente
                </Link>
              )}
              <button
                onClick={() => onReenviar(nota)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
              >
                <RotateCcw size={15} />
                Reenviar
              </button>
            </div>
          </>
        )}
        {nota && status !== "processando" && (
          <div className="mt-4">
            <StatusNotaBadge status={nota.status} motivo={nota.motivoRejeicao} />
          </div>
        )}
        <button onClick={onNovaVenda} className="mt-6 text-sm text-blue-600 hover:underline">
          Nova venda
        </button>
      </div>
    </div>
  );
}
