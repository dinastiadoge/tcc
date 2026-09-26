import { useState } from "react";
import { Search, XCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface NotaParaCancelar {
  id: number;
  numero: string;
  serie: string;
  cliente: string;
  valor: number;
  dataEmissao: string;
  chaveAcesso: string;
  status: "autorizada" | "cancelada";
}

const notas: NotaParaCancelar[] = [
  { id: 1, numero: "000126", serie: "1", cliente: "Transportadora Rápida Ltda", valor: 3450.0, dataEmissao: "23/04/2026", chaveAcesso: "35260412345678000195550010001260001234567890", status: "autorizada" },
  { id: 2, numero: "000125", serie: "1", cliente: "Posto Central", valor: 780.0, dataEmissao: "23/04/2026", chaveAcesso: "35260498765432000111550010001250009876543210", status: "autorizada" },
  { id: 3, numero: "000124", serie: "1", cliente: "Retífica Souza Ltda", valor: 2890.0, dataEmissao: "23/04/2026", chaveAcesso: "35260445678901000123550010001240004567890120", status: "autorizada" },
  { id: 4, numero: "000121", serie: "1", cliente: "Caminhões e CIA", valor: 4120.0, dataEmissao: "22/04/2026", chaveAcesso: "35260456789012000189550010001210005678901230", status: "cancelada" },
];

export function Cancelamento() {
  const [busca, setBusca] = useState("");
  const [notaSelecionada, setNotaSelecionada] = useState<NotaParaCancelar | null>(null);
  const [justificativa, setJustificativa] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const notasFiltradas = notas.filter(
    (n) =>
      n.status === "autorizada" &&
      (busca === "" ||
        n.numero.includes(busca) ||
        n.cliente.toLowerCase().includes(busca.toLowerCase())),
  );

  const handleCancelar = async () => {
    if (justificativa.trim().length < 15) return;
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setNotaSelecionada(null);
      setJustificativa("");
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="text-red-600" size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">Cancelamento de NF-e</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Cancelamento de notas autorizadas dentro do prazo legal (24h)
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-0.5">Atenção</p>
          <p>O cancelamento só é permitido em até 24 horas após a autorização da nota fiscal e exige justificativa com no mínimo 15 caracteres.</p>
        </div>
      </div>

      {sucesso ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg text-gray-900 mb-1">Cancelamento enviado!</h3>
          <p className="text-sm text-gray-500">O evento de cancelamento foi transmitido à SEFAZ.</p>
        </div>
      ) : notaSelecionada ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base text-gray-900">Confirmar Cancelamento</h2>
            <button
              onClick={() => setNotaSelecionada(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Número/Série</p>
              <p className="text-sm text-gray-900 font-medium">{notaSelecionada.numero}/{notaSelecionada.serie}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Cliente</p>
              <p className="text-sm text-gray-900 font-medium">{notaSelecionada.cliente}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Valor</p>
              <p className="text-sm text-gray-900 font-medium">R$ {notaSelecionada.valor.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Data de Emissão</p>
              <p className="text-sm text-gray-900 font-medium">{notaSelecionada.dataEmissao}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 mb-0.5">Chave de Acesso</p>
              <p className="text-xs text-gray-700 font-mono break-all">{notaSelecionada.chaveAcesso}</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-2">
              Justificativa do Cancelamento <span className="text-red-500">*</span>
              <span className="text-gray-400 ml-1">(mín. 15 caracteres)</span>
            </label>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo do cancelamento..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <p className={`text-xs mt-1 ${justificativa.length < 15 ? "text-gray-400" : "text-green-600"}`}>
              {justificativa.length} / 15 caracteres mínimos
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setNotaSelecionada(null)}
              className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCancelar}
              disabled={justificativa.trim().length < 15 || enviando}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300 rounded-lg transition-colors"
            >
              {enviando ? (
                <>
                  <Clock size={14} className="animate-spin" />
                  Transmitindo...
                </>
              ) : (
                <>
                  <XCircle size={14} />
                  Confirmar Cancelamento
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="mb-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por número ou cliente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="space-y-2">
            {notasFiltradas.map((nota) => (
              <div
                key={nota.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-gray-900">NF-e {nota.numero}/{nota.serie}</span>
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Autorizada</span>
                  </div>
                  <p className="text-sm text-gray-600">{nota.cliente}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{nota.dataEmissao} · R$ {nota.valor.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setNotaSelecionada(nota)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors ml-4"
                >
                  <XCircle size={13} />
                  Cancelar NF-e
                </button>
              </div>
            ))}
            {notasFiltradas.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">
                Nenhuma nota autorizada encontrada
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
