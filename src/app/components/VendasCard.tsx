import { Search, Plus } from 'lucide-react';

export function VendasCard() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Vendas Ágeis</h2>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="cnpj" className="block text-xs sm:text-sm text-gray-700 mb-2">
            Buscar Cliente por CNPJ
          </label>
          <div className="relative">
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>Novo Pedido/Nota Fiscal</span>
        </button>
      </div>
    </div>
  );
}
