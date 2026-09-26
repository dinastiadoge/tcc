import { useState } from "react";
import { Archive, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export function Inutilizacao() {
  const [form, setForm] = useState({
    serie: "1",
    numeroInicial: "",
    numeroFinal: "",
    justificativa: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.serie &&
    form.numeroInicial &&
    form.numeroFinal &&
    form.justificativa.trim().length >= 15 &&
    parseInt(form.numeroFinal) >= parseInt(form.numeroInicial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setErro("");
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEnviando(false);
    setSucesso(true);
    setTimeout(() => {
      setSucesso(false);
      setForm({ serie: "1", numeroInicial: "", numeroFinal: "", justificativa: "" });
    }, 3000);
  };

  const inutilizacoes = [
    { id: 1, serie: "1", inicio: "000110", fim: "000115", data: "20/04/2026", motivo: "Erro de emissão durante queda de sistema", status: "inutilizada" },
    { id: 2, serie: "1", inicio: "000098", fim: "000098", data: "10/03/2026", motivo: "Numeração pulada por falha no sistema", status: "inutilizada" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Archive className="text-gray-700" size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">Inutilização de Numeração</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Inutilize faixas de numeração de NF-e não utilizadas junto à SEFAZ
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-0.5">Atenção</p>
          <p>A inutilização é irreversível. Utilize apenas para numerações que não foram e não serão utilizadas.</p>
        </div>
      </div>

      {sucesso ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg text-gray-900 mb-1">Inutilização registrada!</h3>
          <p className="text-sm text-gray-500">A faixa foi inutilizada junto à SEFAZ com sucesso.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
            <h2 className="text-base text-gray-900 mb-5">Nova Inutilização</h2>

            {erro && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1.5">Série</label>
                <input
                  type="text"
                  value={form.serie}
                  onChange={(e) => set("serie", e.target.value)}
                  placeholder="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Número Inicial</label>
                  <input
                    type="number"
                    value={form.numeroInicial}
                    onChange={(e) => set("numeroInicial", e.target.value)}
                    placeholder="000001"
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Número Final</label>
                  <input
                    type="number"
                    value={form.numeroFinal}
                    onChange={(e) => set("numeroFinal", e.target.value)}
                    placeholder="000010"
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {form.numeroInicial && form.numeroFinal && parseInt(form.numeroFinal) >= parseInt(form.numeroInicial) && (
                <div className="p-2.5 bg-blue-50 rounded-lg text-xs text-blue-700">
                  {parseInt(form.numeroFinal) - parseInt(form.numeroInicial) + 1} número(s) serão inutilizados
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1.5">
                  Justificativa <span className="text-red-500">*</span>
                  <span className="text-gray-400 ml-1">(mín. 15 caracteres)</span>
                </label>
                <textarea
                  value={form.justificativa}
                  onChange={(e) => set("justificativa", e.target.value)}
                  placeholder="Descreva o motivo da inutilização..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className={`text-xs mt-1 ${form.justificativa.length < 15 ? "text-gray-400" : "text-green-600"}`}>
                  {form.justificativa.length} / 15 mínimo
                </p>
              </div>

              <button
                type="submit"
                disabled={!isValid || enviando}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm text-white bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 rounded-lg transition-colors"
              >
                {enviando ? (
                  <>
                    <Clock size={14} className="animate-spin" />
                    Transmitindo à SEFAZ...
                  </>
                ) : (
                  <>
                    <Archive size={14} />
                    Inutilizar Numeração
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
            <h2 className="text-base text-gray-900 mb-4">Histórico de Inutilizações</h2>
            <div className="space-y-3">
              {inutilizacoes.map((item) => (
                <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      Série {item.serie} · {item.inicio} a {item.fim}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      Inutilizada
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{item.data}</p>
                  <p className="text-xs text-gray-600 mt-1">{item.motivo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
