import { Search, Plus, Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { produtosService } from "../services";
import type { Produto, ProdutoInput } from "../types";
import { useApi } from "../lib/useApi";
import { dinheiro, errosPorCampo, mensagemErro, ncm as formatarNcm, somenteDigitos } from "../lib/formato";

const produtoVazio: ProdutoInput = {
  codigo: "",
  nome: "",
  ncm: "",
  estoqueAtual: 0,
  estoqueMinimo: 0,
  precoCusto: 0,
  precoVenda: 0,
};

function ModalEditarProduto({
  produto,
  onSalvo,
  onFechar,
}: {
  produto: Produto | null;
  onSalvo: (p: Produto) => void;
  onFechar: () => void;
}) {
  const [form, setForm] = useState<ProdutoInput>(() => {
    if (!produto) return { ...produtoVazio };
    const { id: _id, status: _status, ...resto } = produto;
    return resto;
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});

  const set = (field: keyof ProdutoInput, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setErros({});
    const dados = { ...form, ncm: somenteDigitos(form.ncm) };
    try {
      const salvo = produto
        ? await produtosService.atualizar(produto.id, dados)
        : await produtosService.criar(dados);
      onSalvo(salvo);
    } catch (err) {
      setErro(mensagemErro(err));
      setErros(errosPorCampo(err));
    } finally {
      setSalvando(false);
    }
  };

  const erroDe = (campo: string) => erros[campo] && <p className="text-xs text-red-600 mt-1">{erros[campo]}</p>;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg text-gray-900">{produto ? "Editar Produto" : "Novo Produto"}</h3>
          <button
            onClick={onFechar}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {erro && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{erro}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) => set("codigo", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              {erroDe("codigo")}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">NCM</label>
              <input
                type="text"
                value={form.ncm}
                onChange={(e) => set("ncm", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              {erroDe("ncm")}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1.5">Nome do Produto</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => set("nome", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
              {erroDe("nome")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Estoque Atual</label>
              <input
                type="number"
                value={form.estoqueAtual}
                onChange={(e) => set("estoqueAtual", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              {erroDe("estoqueAtual")}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Estoque Mínimo</label>
              <input
                type="number"
                value={form.estoqueMinimo}
                onChange={(e) => set("estoqueMinimo", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              {erroDe("estoqueMinimo")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.precoCusto}
                onChange={(e) => set("precoCusto", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              {erroDe("precoCusto")}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.precoVenda}
                onChange={(e) => set("precoVenda", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              {erroDe("precoVenda")}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors"
            >
              {salvando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {produto ? "Salvar Alterações" : "Cadastrar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Estoque() {
  const [busca, setBusca] = useState("");
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [novo, setNovo] = useState(false);

  const { dados, carregando, erro, recarregar } = useApi(() => produtosService.listar(), []);
  const resumo = useApi(() => produtosService.resumo(), []);
  const produtos = dados ?? [];

  const produtosFiltrados = produtos.filter(
    (p) =>
      busca === "" ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase()),
  );

  const r = resumo.dados;
  const estatisticas = [
    { label: "Total de Produtos", valor: r ? String(r.totalProdutos) : "...", icone: Package, cor: "blue" },
    { label: "Estoque Baixo", valor: r ? String(r.estoqueBaixo) : "...", icone: AlertTriangle, cor: "orange" },
    { label: "Valor em Estoque", valor: r ? dinheiro(r.valorEmEstoque) : "...", icone: TrendingUp, cor: "green" },
    { label: "Itens Críticos", valor: r ? String(r.itensCriticos) : "...", icone: TrendingDown, cor: "red" },
  ];

  const fechar = () => {
    setProdutoEditando(null);
    setNovo(false);
  };

  const aoSalvar = (p: Produto) => {
    toast.success(novo ? `Produto ${p.codigo} cadastrado.` : `Produto ${p.codigo} atualizado.`);
    fechar();
    recarregar();
    resumo.recarregar();
  };

  const excluir = async (p: Produto) => {
    if (!window.confirm(`Excluir o produto ${p.codigo} - ${p.nome}?`)) return;
    try {
      await produtosService.excluir(p.id);
      toast.success(`Produto ${p.codigo} excluído.`);
      recarregar();
      resumo.recarregar();
    } catch (e) {
      toast.error(mensagemErro(e));
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "critico")
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-700">Crítico</span>;
    if (status === "baixo")
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">Baixo</span>;
    if (status === "atencao")
      return <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">Atenção</span>;
    return <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">OK</span>;
  };

  return (
    <>
      {(produtoEditando || novo) && (
        <ModalEditarProduto
          produto={novo ? null : produtoEditando}
          onSalvo={aoSalvar}
          onFechar={fechar}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Gestão de Estoque</h1>
          <p className="text-sm sm:text-base text-gray-600">Controle completo do inventário de autopeças</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {estatisticas.map((stat, index) => {
            const Icon = stat.icone;
            const corClasses = {
              blue: "bg-blue-100 text-blue-600",
              orange: "bg-orange-100 text-orange-600",
              green: "bg-green-100 text-green-600",
              red: "bg-red-100 text-red-600",
            };
            return (
              <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl text-gray-900">{stat.valor}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg ${corClasses[stat.cor as keyof typeof corClasses]}`}>
                    <Icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg text-gray-900">Lista de Produtos</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-1 sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por código ou nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <button
                onClick={() => setNovo(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap text-sm">
                <Plus size={16} />
                <span>Novo Produto</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-3 text-xs text-gray-500">Código</th>
                  <th className="text-left py-3 px-2 sm:px-3 text-xs text-gray-500">Produto</th>
                  <th className="text-left py-3 px-2 sm:px-3 text-xs text-gray-500">NCM</th>
                  <th className="text-center py-3 px-2 sm:px-3 text-xs text-gray-500">Estoque</th>
                  <th className="text-center py-3 px-2 sm:px-3 text-xs text-gray-500">Mínimo</th>
                  <th className="text-right py-3 px-2 sm:px-3 text-xs text-gray-500">Custo</th>
                  <th className="text-right py-3 px-2 sm:px-3 text-xs text-gray-500">Venda</th>
                  <th className="text-center py-3 px-2 sm:px-3 text-xs text-gray-500">Status</th>
                  <th className="text-center py-3 px-2 sm:px-3 text-xs text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 sm:px-3 text-xs text-gray-500">{produto.codigo}</td>
                    <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">{produto.nome}</td>
                    <td className="py-3 px-2 sm:px-3 text-xs text-gray-500">{formatarNcm(produto.ncm)}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-900">{produto.estoqueAtual}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-xs text-gray-500">{produto.estoqueMinimo}</td>
                    <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                      {dinheiro(produto.precoCusto)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                      {dinheiro(produto.precoVenda)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-center">
                      {getStatusBadge(produto.status)}
                    </td>
                    <td className="py-3 px-2 sm:px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setProdutoEditando(produto)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                          title="Editar produto"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => excluir(produto)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {produtosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-sm text-gray-400">
                      {carregando ? "Carregando..." : erro ?? "Nenhum produto encontrado"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
