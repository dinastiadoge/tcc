import { Component } from '@angular/core';
import { LucideAngularModule, Plus, Search } from 'lucide-angular';

@Component({
  selector: 'app-vendas-card',
  imports: [LucideAngularModule],
  template: `
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 class="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Vendas Ágeis</h2>

      <div class="space-y-3 sm:space-y-4">
        <div>
          <label for="cnpj" class="block text-xs sm:text-sm text-gray-700 mb-2">
            Buscar Cliente por CNPJ
          </label>
          <div class="relative">
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <lucide-icon [img]="SearchIcon" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
          <lucide-icon [img]="PlusIcon" [size]="18" class="sm:w-5 sm:h-5" />
          <span>Novo Pedido/Nota Fiscal</span>
        </button>
      </div>
    </div>
  `,
})
export class VendasCard {
  protected readonly SearchIcon = Search;
  protected readonly PlusIcon = Plus;
}
