import { useState } from "react";
import { Search, RotateCcw, Plus, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface ItemDevolucao {
  id: number;
  codigo: string;
  nome: string;
  qtdOriginal: number;
  qtdDevolver: number;
  valorUnitario: number;
}

const notasReferencia = [
  { numero: "000126", serie: "1", cliente: "Transportadora Rápida Ltda", cnpj: "12.345.678/0001-90", valor: 3450.0, data: "23/04/2026" },
  { numero: "000125", serie: "1", cliente: "Posto Central", cnpj: "98.765.432/0001-11", valor: 780.0, data: "23/04/2026" },
  { numero: "000124", serie: "1", cliente: "Retífica Souza Ltda", cnpj: "45.678.901/0001-23", valor: 2890.0, data: "23/04/2026" },
];

const itensMock: ItemDevolucao[] = [
  { id: 1, codigo: "PF-001", nome: "Pastilha de Freio Dianteira", qtdOriginal: 4, qtdDevolver: 2, valorUnitario: 125.0 },
  { id: 2, codigo: "FO-023", nome: "Filtro de Óleo Motor", qtdOriginal: 2, qtdDevolver: 1, valorUnitario: 45.9 },
];

export function NotaDevolucao() {
  const [busca, setBusca] = useState("");
  const [notaRef, setNotaRef] = useState<typeof notasReferencia[0] | null>(null);
  const [itens, setItens] = useState<ItemDevolucao[]>([]);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const notasFiltradas = notasReferencia.filter(
    (n) =>
      busca === "" ||
      n.numero.includes(busca) ||
      n.cliente.toLowerCase().includes(busca.toLowerCase()),
  );

  const selecionarNota = (nota: typeof notasReferencia[0]) => {
    setNotaRef(nota);
    setItens(itensMock.map((i) => ({ ...i })));
  };

  const atualizarQtd = (id: number, qtd: number) => {
    setItens(
      itens.map((i) =>
        i.id === id ? { ...i, qtdDevolver: Math.max(0, Math.min(qtd, i.qtdOriginal)) } : i,
      ),
    );
  };

  const removerItem = (id: number) => setItens(itens.filter((i) => i.id !== id));

  const totalDevolucao = itens.reduce((acc, i) => acc + i.qtdDevolver * i.valorUnitario, 0);

  const handleEmitir = async () => {
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1400));
    setEnviando(false);
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setNotaRef(null);
      setItens([]);
      setMotivo("");
      setBusca("");
    }, 2500);
  };

  if (sucesso) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="text-lg text-gray-900 mb-1">Nota de devolução emitida!</h3>
        <p className="text-sm text-gray-500">A NF-e de devolução foi autorizada pela SEFAZ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <RotateCcw className="text-orange-600" size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">Nota Fiscal de Devolução</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Emissão de NF-e de devolução referenciando a nota original
        </p>
      </div>

      {!notaRef ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <h2 className="text-base text-gray-900 mb-4">Selecionar Nota Fiscal Original</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar por número ou cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="space-y-2">
            {notasFiltradas.map((nota) => (
              <div
                key={nota.numero}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer"
                onClick={() => selecionarNota(nota)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">NF-e {nota.numero}/{nota.serie}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Autorizada</span>
                  </div>
                  <p className="text-sm text-gray-600">{nota.cliente} · {nota.cnpj}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{nota.data} · R$ {nota.valor.toFixed(2)}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <RotateCcw size={12} />
                  Devolver
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm text-gray-700">Nota Referenciada</h2>
              <button
                onClick={() => { setNotaRef(null); setItens([]); }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Trocar nota
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Número</p>
                <p className="text-sm font-medium text-gray-900">{notaRef.numero}/{notaRef.serie}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="text-sm font-medium text-gray-900 truncate">{notaRef.cliente}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Data</p>
                <p className="text-sm font-medium text-gray-900">{notaRef.data}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Valor Original</p>
                <p className="text-sm font-medium text-gray-900">R$ {notaRef.valor.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base text-gray-900">Itens a Devolver</h2>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                <Plus size={14} />
                Adicionar item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2.5 px-2 text-xs text-gray-500">Produto</th>
                    <th className="text-center py-2.5 px-2 text-xs text-gray-500">Qtd Original</th>
                    <th className="text-center py-2.5 px-2 text-xs text-gray-500">Qtd Devolver</th>
                    <th className="text-right py-2.5 px-2 text-xs text-gray-500">Valor Unit.</th>
                    <th className="text-right py-2.5 px-2 text-xs text-gray-500">Subtotal</th>
                    <th className="py-2.5 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        <p className="text-xs font-medium text-gray-900">{item.nome}</p>
                        <p className="text-xs text-gray-400">{item.codigo}</p>
                      </td>
                      <td className="py-3 px-2 text-center text-sm text-gray-500">{item.qtdOriginal}</td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          value={item.qtdDevolver}
                          onChange={(e) => atualizarQtd(item.id, parseInt(e.target.value) || 0)}
                          min={0}
                          max={item.qtdOriginal}
                          className="w-14 px-1.5 py-1 text-sm text-center border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-right text-sm text-gray-900">
                        R$ {item.valorUnitario.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-sm text-gray-900">
                        R$ {(item.qtdDevolver * item.valorUnitario).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => removerItem(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Total da Devolução</span>
                <span className="text-lg font-semibold text-orange-600">R$ {totalDevolucao.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <label className="block text-sm text-gray-700 mb-2">Motivo da Devolução</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo da devolução..."
              rows={2}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setNotaRef(null); setItens([]); }}
              className="flex-1 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEmitir}
              disabled={itens.length === 0 || totalDevolucao === 0 || enviando}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 rounded-lg transition-colors"
            >
              {enviando ? (
                <>
                  <Clock size={14} className="animate-spin" />
                  Emitindo...
                </>
              ) : (
                <>
                  <RotateCcw size={14} />
                  Emitir Nota de Devolução
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
