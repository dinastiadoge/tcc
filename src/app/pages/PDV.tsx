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
} from "lucide-react";
import { useState } from "react";

interface ItemCarrinho {
  id: number;
  codigo: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  editandoPreco: boolean;
  precoTemp: string;
}

type TipoDocumento = "nfe" | "nfce";
type Modalidade = "fisica" | "virtual";
type DestinoMoeda = "banco" | "cofre";
type MetodoPagamento = "dinheiro" | "credito" | "debito" | "pix" | "boleto";
type BandeiraCartao = "mastercard" | "visa" | "elo" | "outros";

const BANDEIRAS: { value: BandeiraCartao; label: string }[] = [
  { value: "mastercard", label: "Mastercard" },
  { value: "visa", label: "Visa" },
  { value: "elo", label: "Elo" },
  { value: "outros", label: "Outros" },
];

export function PDV() {
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>("nfe");
  const [consumidorIdentificado, setConsumidorIdentificado] = useState(true);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([
    {
      id: 1,
      codigo: "PF-001",
      nome: "Pastilha de Freio Dianteira",
      quantidade: 2,
      valorUnitario: 125.0,
      editandoPreco: false,
      precoTemp: "125.00",
    },
    {
      id: 2,
      codigo: "FO-023",
      nome: "Filtro de Óleo Motor",
      quantidade: 1,
      valorUnitario: 45.9,
      editandoPreco: false,
      precoTemp: "45.90",
    },
  ]);

  const [modalidade, setModalidade] = useState<Modalidade>("fisica");
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("dinheiro");
  const [bandeira, setBandeira] = useState<BandeiraCartao>("visa");
  const [destinoMoeda, setDestinoMoeda] = useState<DestinoMoeda>("banco");
  const [desconto, setDesconto] = useState(0);

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.quantidade * item.valorUnitario,
    0,
  );
  const total = subtotal - desconto;

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
                      placeholder={tipoDocumento === "nfe" ? "00.000.000/0000-00" : "000.000.000-00"}
                      className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                    Nome / Razão Social
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-lg text-gray-900">Produtos</h2>
              <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                <Plus size={16} />
                <span>Adicionar Produto</span>
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produto por código ou nome..."
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
                      <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">{item.nome}</td>
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
                              R$ {item.valorUnitario.toFixed(2)}
                            </span>
                            <Edit3
                              size={12}
                              className="text-gray-300 group-hover:text-blue-500 transition-colors"
                            />
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                        R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
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
                <span>R$ {subtotal.toFixed(2)}</span>
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
                <span>R$ {total.toFixed(2)}</span>
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
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium">
                <DollarSign size={17} />
                Finalizar Venda
              </button>

              {tipoDocumento === "nfce" && (
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                  <Printer size={16} />
                  Imprimir Cupom (NTH)
                </button>
              )}

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm">
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
