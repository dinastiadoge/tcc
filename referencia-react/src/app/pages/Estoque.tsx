import { Search, Plus, Package, AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2, X, Save } from "lucide-react";
import { useState } from "react";

interface Produto {
  id: number;
  codigo: string;
  nome: string;
  ncm: string;
  estoque: number;
  minimo: number;
  custo: number;
  venda: number;
  status: string;
}

const produtosIniciais: Produto[] = [
  { id: 1, codigo: "PF-001", nome: "Pastilha de Freio Dianteira", ncm: "8708.30.10", estoque: 45, minimo: 20, custo: 85.0, venda: 125.0, status: "ok" },
  { id: 2, codigo: "FO-023", nome: "Filtro de Óleo Motor", ncm: "8421.23.00", estoque: 5, minimo: 15, custo: 28.0, venda: 45.9, status: "baixo" },
  { id: 3, codigo: "CD-045", nome: "Correia Dentada", ncm: "4010.35.00", estoque: 8, minimo: 10, custo: 120.0, venda: 189.9, status: "baixo" },
  { id: 4, codigo: "VI-012", nome: "Vela de Ignição", ncm: "8511.10.00", estoque: 12, minimo: 10, custo: 18.0, venda: 32.9, status: "atencao" },
  { id: 5, codigo: "LH-089", nome: "Lâmpada H4 12V", ncm: "8539.21.00", estoque: 67, minimo: 30, custo: 12.0, venda: 24.9, status: "ok" },
  { id: 6, codigo: "BA-034", nome: "Bateria 60Ah", ncm: "8507.10.00", estoque: 3, minimo: 8, custo: 280.0, venda: 459.0, status: "critico" },
  { id: 7, codigo: "AM-078", nome: "Amortecedor Dianteiro", ncm: "8708.80.00", estoque: 22, minimo: 12, custo: 195.0, venda: 329.9, status: "ok" },
  { id: 8, codigo: "DI-056", nome: "Disco de Freio", ncm: "8708.30.10", estoque: 18, minimo: 15, custo: 145.0, venda: 239.9, status: "atencao" },
];

const estatisticas = [
  { label: "Total de Produtos", valor: "847", icone: Package, cor: "blue" },
  { label: "Estoque Baixo", valor: "23", icone: AlertTriangle, cor: "orange" },
  { label: "Valor em Estoque", valor: "R$ 145.890", icone: TrendingUp, cor: "green" },
  { label: "Itens Críticos", valor: "8", icone: TrendingDown, cor: "red" },
];

function ModalEditarProduto({
  produto,
  onSalvar,
  onFechar,
}: {
  produto: Produto;
  onSalvar: (p: Produto) => void;
  onFechar: () => void;
}) {
  const [form, setForm] = useState<Produto>({ ...produto });

  const set = (field: keyof Produto, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg text-gray-900">Editar Produto</h3>
          <button
            onClick={onFechar}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={(e) => set("codigo", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">NCM</label>
              <input
                type="text"
                value={form.ncm}
                onChange={(e) => set("ncm", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Estoque Atual</label>
              <input
                type="number"
                value={form.estoque}
                onChange={(e) => set("estoque", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Estoque Mínimo</label>
              <input
                type="number"
                value={form.minimo}
                onChange={(e) => set("minimo", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Preço de Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.custo}
                onChange={(e) => set("custo", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.venda}
                onChange={(e) => set("venda", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Save size={15} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais);
  const [busca, setBusca] = useState("");
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const produtosFiltrados = produtos.filter(
    (p) =>
      busca === "" ||
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busca.toLowerCase()),
  );

  const salvarProduto = (produtoAtualizado: Produto) => {
    const estoque = produtoAtualizado.estoque;
    const minimo = produtoAtualizado.minimo;
    let status = "ok";
    if (estoque <= minimo * 0.4) status = "critico";
    else if (estoque < minimo * 0.7) status = "baixo";
    else if (estoque < minimo) status = "atencao";

    setProdutos(
      produtos.map((p) =>
        p.id === produtoAtualizado.id ? { ...produtoAtualizado, status } : p,
      ),
    );
    setProdutoEditando(null);
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
      {produtoEditando && (
        <ModalEditarProduto
          produto={produtoEditando}
          onSalvar={salvarProduto}
          onFechar={() => setProdutoEditando(null)}
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
              <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap text-sm">
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
                    <td className="py-3 px-2 sm:px-3 text-xs text-gray-500">{produto.ncm}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-900">{produto.estoque}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-xs text-gray-500">{produto.minimo}</td>
                    <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                      R$ {produto.custo.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-gray-900">
                      R$ {produto.venda.toFixed(2)}
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
                      Nenhum produto encontrado
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
