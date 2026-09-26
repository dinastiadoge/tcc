import { useState } from "react";
import { PackagePlus, Plus, Trash2, Search, CheckCircle, Clock, Upload } from "lucide-react";

interface ItemEntrada {
  id: number;
  codigo: string;
  descricao: string;
  ncm: string;
  quantidade: number;
  valorUnitario: number;
  cfop: string;
}

const cfopOpcoes = ["1102", "1202", "1403", "1411", "2102", "2202"];

export function NotaEntrada() {
  const [fornecedor, setFornecedor] = useState({
    cnpj: "",
    razaoSocial: "",
    ie: "",
    uf: "SP",
  });
  const [nota, setNota] = useState({
    numero: "",
    serie: "1",
    dataEmissao: "",
    dataEntrada: new Date().toISOString().split("T")[0],
    chaveAcesso: "",
    naturezaOperacao: "Compra para comercialização",
  });
  const [itens, setItens] = useState<ItemEntrada[]>([
    { id: 1, codigo: "PF-001", descricao: "Pastilha de Freio Dianteira", ncm: "8708.30.10", quantidade: 20, valorUnitario: 85.0, cfop: "1102" },
  ]);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const setForn = (field: string, value: string) =>
    setFornecedor((prev) => ({ ...prev, [field]: value }));
  const setNot = (field: string, value: string) =>
    setNota((prev) => ({ ...prev, [field]: value }));

  const addItem = () => {
    setItens([
      ...itens,
      {
        id: Date.now(),
        codigo: "",
        descricao: "",
        ncm: "",
        quantidade: 1,
        valorUnitario: 0,
        cfop: "1102",
      },
    ]);
  };

  const updateItem = (id: number, field: string, value: string | number) => {
    setItens(itens.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const removeItem = (id: number) => setItens(itens.filter((i) => i.id !== id));

  const totalNota = itens.reduce((acc, i) => acc + i.quantidade * i.valorUnitario, 0);

  const handleSalvar = async () => {
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  };

  if (sucesso) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg text-gray-900 mb-1">Nota de entrada registrada!</h3>
        <p className="text-sm text-gray-500">Os itens foram adicionados ao estoque automaticamente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PackagePlus className="text-blue-600" size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">Cadastro de Nota de Entrada</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Registre notas de entrada de fornecedores e atualize o estoque automaticamente
        </p>
      </div>

      <div className="space-y-5">
        {/* Importar XML */}
        <div className="bg-white rounded-xl shadow-sm border border-dashed border-blue-300 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Upload className="text-blue-500" size={20} />
              <div>
                <p className="text-sm font-medium text-gray-900">Importar XML da NF-e</p>
                <p className="text-xs text-gray-500">Carregue o arquivo XML para preencher automaticamente</p>
              </div>
            </div>
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors">
              <Upload size={14} />
              Selecionar XML
              <input type="file" accept=".xml" className="hidden" />
            </label>
          </div>
        </div>

        {/* Dados do Fornecedor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h2 className="text-base text-gray-900 mb-4">Fornecedor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs text-gray-600 mb-1.5">CNPJ *</label>
              <div className="relative">
                <input
                  type="text"
                  value={fornecedor.cnpj}
                  onChange={(e) => setForn("cnpj", e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1.5">Razão Social *</label>
              <input
                type="text"
                value={fornecedor.razaoSocial}
                onChange={(e) => setForn("razaoSocial", e.target.value)}
                placeholder="Nome do fornecedor"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">UF</label>
              <select
                value={fornecedor.uf}
                onChange={(e) => setForn("uf", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["SP","RJ","MG","RS","PR","SC","BA","GO","PE","CE"].map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dados da Nota */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h2 className="text-base text-gray-900 mb-4">Dados da Nota Fiscal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Número *</label>
              <input
                type="text"
                value={nota.numero}
                onChange={(e) => setNot("numero", e.target.value)}
                placeholder="000001"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Série</label>
              <input
                type="text"
                value={nota.serie}
                onChange={(e) => setNot("serie", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Natureza da Operação</label>
              <input
                type="text"
                value={nota.naturezaOperacao}
                onChange={(e) => setNot("naturezaOperacao", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Data de Emissão *</label>
              <input
                type="date"
                value={nota.dataEmissao}
                onChange={(e) => setNot("dataEmissao", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Data de Entrada</label>
              <input
                type="date"
                value={nota.dataEntrada}
                onChange={(e) => setNot("dataEntrada", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1.5">Chave de Acesso</label>
              <input
                type="text"
                value={nota.chaveAcesso}
                onChange={(e) => setNot("chaveAcesso", e.target.value)}
                placeholder="44 dígitos"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base text-gray-900">Itens da Nota</h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Adicionar item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2.5 px-2 text-xs text-gray-500">Código</th>
                  <th className="text-left py-2.5 px-2 text-xs text-gray-500">Descrição</th>
                  <th className="text-left py-2.5 px-2 text-xs text-gray-500">NCM</th>
                  <th className="text-left py-2.5 px-2 text-xs text-gray-500">CFOP</th>
                  <th className="text-center py-2.5 px-2 text-xs text-gray-500">Qtd</th>
                  <th className="text-right py-2.5 px-2 text-xs text-gray-500">Vlr Unit.</th>
                  <th className="text-right py-2.5 px-2 text-xs text-gray-500">Total</th>
                  <th className="py-2.5 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.codigo}
                        onChange={(e) => updateItem(item.id, "codigo", e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.descricao}
                        onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                        className="w-full min-w-[140px] px-2 py-1 text-xs border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.ncm}
                        onChange={(e) => updateItem(item.id, "ncm", e.target.value)}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <select
                        value={item.cfop}
                        onChange={(e) => updateItem(item.id, "cfop", e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {cfopOpcoes.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => updateItem(item.id, "quantidade", parseInt(e.target.value) || 1)}
                        min={1}
                        className="w-14 px-1.5 py-1 text-xs text-center border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.valorUnitario}
                        onChange={(e) => updateItem(item.id, "valorUnitario", parseFloat(e.target.value) || 0)}
                        min={0}
                        className="w-24 px-1.5 py-1 text-xs text-right border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-gray-900">
                      R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Total da Nota</span>
              <span className="text-lg font-semibold text-blue-700">R$ {totalNota.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={enviando || !nota.numero || !fornecedor.cnpj}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors"
          >
            {enviando ? (
              <>
                <Clock size={14} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <PackagePlus size={14} />
                Registrar Nota de Entrada
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
