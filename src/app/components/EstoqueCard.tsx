import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { produtosService } from '../services';
import { useApi } from '../lib/useApi';
import { ncm } from '../lib/formato';

const ordem = { critico: 0, baixo: 1, atencao: 2, ok: 3 } as const;

export function EstoqueCard() {
  const { dados, carregando, erro } = useApi(() => produtosService.listar(), []);
  // Os que estão abaixo do mínimo, do mais urgente para o menos urgente.
  const produtosBaixoEstoque = (dados ?? [])
    .filter((p) => p.status !== 'ok')
    .sort((a, b) => ordem[a.status] - ordem[b.status] || a.estoqueAtual - b.estoqueAtual)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <AlertCircle className="text-orange-500" size={20} />
        <h2 className="text-base sm:text-lg text-gray-900">Alerta de Estoque</h2>
        <Link to="/estoque" className="ml-auto text-xs text-blue-600 hover:underline">Ver estoque</Link>
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
                <td className="py-3 px-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{ncm(produto.ncm)}</td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs sm:text-sm ${
                      produto.status === 'critico'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                    title={`Mínimo: ${produto.estoqueMinimo}`}
                  >
                    {produto.estoqueAtual}
                  </span>
                </td>
              </tr>
            ))}
            {produtosBaixoEstoque.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-gray-400">
                  {carregando ? 'Carregando...' : erro ?? 'Nenhum produto abaixo do mínimo'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
