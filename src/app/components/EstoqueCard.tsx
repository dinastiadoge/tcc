import { AlertCircle } from 'lucide-react';

const produtosBaixoEstoque = [
  { id: 1, nome: 'Pastilha de Freio Dianteira', ncm: '8708.30.10', quantidade: 3, critico: true },
  { id: 2, nome: 'Filtro de Óleo Motor', ncm: '8421.23.00', quantidade: 5, critico: true },
  { id: 3, nome: 'Correia Dentada', ncm: '4010.35.00', quantidade: 8, critico: false },
  { id: 4, nome: 'Vela de Ignição', ncm: '8511.10.00', quantidade: 12, critico: false },
  { id: 5, nome: 'Lâmpada H4 12V', ncm: '8539.21.00', quantidade: 15, critico: false },
];

export function EstoqueCard() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <AlertCircle className="text-orange-500" size={20} />
        <h2 className="text-base sm:text-lg text-gray-900">Alerta de Estoque</h2>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-xs sm:text-sm text-gray-600">Nome</th>
              <th className="text-left py-2 px-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">Código NCM</th>
              <th className="text-right py-2 px-3 text-xs sm:text-sm text-gray-600">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {produtosBaixoEstoque.map((produto) => (
              <tr key={produto.id} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-3 text-xs sm:text-sm text-gray-900">{produto.nome}</td>
                <td className="py-3 px-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{produto.ncm}</td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs sm:text-sm ${
                      produto.critico
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {produto.quantidade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
