import { VendasCard } from '../components/VendasCard';
import { EstoqueCard } from '../components/EstoqueCard';
import { FiscalCard } from '../components/FiscalCard';

export function Home() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">Bem-vindo ao Sistema</h1>
        <p className="text-sm sm:text-base text-gray-600 capitalize">{currentDate}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <VendasCard />
        <EstoqueCard />
        <FiscalCard />
      </div>
    </div>
  );
}
