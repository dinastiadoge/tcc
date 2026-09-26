import { FileText, Download, Archive } from 'lucide-react';

const notasEmitidas = [
  { id: 1, numero: '000123', cliente: 'Auto Mecânica Silva', valor: 'R$ 1.250,00', hora: '09:15' },
  { id: 2, numero: '000124', cliente: 'Retífica Souza Ltda', valor: 'R$ 2.890,00', hora: '10:32' },
  { id: 3, numero: '000125', cliente: 'Posto Central', valor: 'R$ 780,00', hora: '11:45' },
  { id: 4, numero: '000126', cliente: 'Transportadora Rápida', valor: 'R$ 3.450,00', hora: '14:20' },
];

export function FiscalCard() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <FileText className="text-blue-600" size={20} />
        <h2 className="text-base sm:text-lg text-gray-900">Ações Fiscais</h2>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {notasEmitidas.map((nota) => (
          <div key={nota.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm text-gray-900">NF-e {nota.numero}</span>
                <span className="text-xs text-gray-500">{nota.hora}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate mt-0.5">{nota.cliente}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              <span className="text-xs sm:text-sm text-green-600 mr-1 sm:mr-2 hidden sm:inline">{nota.valor}</span>
              <button className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors" title="Baixar XML">
                <Download size={14} className="text-gray-600 sm:w-4 sm:h-4" />
              </button>
              <button className="p-1 sm:p-1.5 hover:bg-white rounded transition-colors" title="Baixar PDF">
                <FileText size={14} className="text-gray-600 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
        <Archive size={18} className="sm:w-5 sm:h-5" />
        <span>Enviar lote para Contador</span>
      </button>
    </div>
  );
}
