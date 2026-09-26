import { FileText, Download, Archive, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const notasFiscais = [
  { id: 1, numero: '000126', serie: '1', cliente: 'Transportadora Rápida Ltda', cnpj: '12.345.678/0001-90', valor: 3450.00, data: '23/04/2026', hora: '14:20', status: 'autorizada' },
  { id: 2, numero: '000125', serie: '1', cliente: 'Posto Central', cnpj: '98.765.432/0001-11', valor: 780.00, data: '23/04/2026', hora: '11:45', status: 'autorizada' },
  { id: 3, numero: '000124', serie: '1', cliente: 'Retífica Souza Ltda', cnpj: '45.678.901/0001-23', valor: 2890.00, data: '23/04/2026', hora: '10:32', status: 'autorizada' },
  { id: 4, numero: '000123', serie: '1', cliente: 'Auto Mecânica Silva', cnpj: '23.456.789/0001-45', valor: 1250.00, data: '23/04/2026', hora: '09:15', status: 'autorizada' },
  { id: 5, numero: '000122', serie: '1', cliente: 'Oficina do João', cnpj: '34.567.890/0001-67', valor: 567.50, data: '22/04/2026', hora: '16:38', status: 'autorizada' },
  { id: 6, numero: '000121', serie: '1', cliente: 'Caminhões e CIA', cnpj: '56.789.012/0001-89', valor: 4120.00, data: '22/04/2026', hora: '15:12', status: 'cancelada' },
  { id: 7, numero: '000120', serie: '1', cliente: 'Auto Peças Express', cnpj: '67.890.123/0001-01', valor: 923.00, data: '22/04/2026', hora: '13:45', status: 'processando' },
  { id: 8, numero: '000119', serie: '1', cliente: 'Mecânica Roda Viva', cnpj: '78.901.234/0001-12', valor: 1567.80, data: '22/04/2026', hora: '11:20', status: 'autorizada' },
];

const estatisticas = [
  { label: 'Emitidas Hoje', valor: '4', cor: 'blue' },
  { label: 'Total do Dia', valor: 'R$ 8.370', cor: 'green' },
  { label: 'Autorizadas', valor: '6', cor: 'green' },
  { label: 'Canceladas', valor: '1', cor: 'red' },
];

export function PainelFiscal() {
  const getStatusBadge = (status: string) => {
    if (status === 'autorizada') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-700">
          <CheckCircle size={14} />
          Autorizada
        </span>
      );
    }
    if (status === 'cancelada') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-red-100 text-red-700">
          <XCircle size={14} />
          Cancelada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
        <Clock size={14} />
        Processando
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Painel Fiscal</h1>
        <p className="text-sm sm:text-base text-gray-600">Gestão de notas fiscais e documentos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {estatisticas.map((stat, index) => {
          const corClasses = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600',
          };

          return (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-lg sm:text-2xl ${corClasses[stat.cor as keyof typeof corClasses].replace('bg-', 'text-').replace('-100', '-700')}`}>
                {stat.valor}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg text-gray-900">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base">
              <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Emitir NF-e</span>
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base">
              <Archive size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Enviar Lote ao Contador</span>
              <span className="sm:hidden">Enviar Lote</span>
            </button>
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base">
              <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Exportar Relatório</span>
              <span className="sm:hidden">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg text-gray-900">Notas Fiscais Recentes</h2>
          <div className="flex gap-2 sm:gap-3">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm sm:text-base">
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Número</th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Cliente</th>
                <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">CNPJ</th>
                <th className="text-right py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Valor</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Data/Hora</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Status</th>
                <th className="text-center py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {notasFiscais.map((nota) => (
                <tr key={nota.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">
                    {nota.numero}/{nota.serie}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900">{nota.cliente}</td>
                  <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600">{nota.cnpj}</td>
                  <td className="py-3 px-2 sm:px-3 text-right text-xs sm:text-sm text-green-600">
                    R$ {nota.valor.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center text-xs sm:text-sm text-gray-600">
                    {nota.data} {nota.hora}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    {getStatusBadge(nota.status)}
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        className="p-1 sm:p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Baixar XML"
                      >
                        <Download size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        className="p-1 sm:p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Baixar PDF"
                      >
                        <FileText size={14} className="text-gray-600 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
