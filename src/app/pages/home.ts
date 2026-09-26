import { Component } from '@angular/core';
import { EstoqueCard } from '../cards/estoque-card';
import { FiscalCard } from '../cards/fiscal-card';
import { VendasCard } from '../cards/vendas-card';

@Component({
  selector: 'app-home',
  imports: [VendasCard, EstoqueCard, FiscalCard],
  template: `
    <div class="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl sm:text-3xl text-gray-900 mb-2">Bem-vindo ao Sistema</h1>
        <p class="text-sm sm:text-base text-gray-600 capitalize">{{ currentDate }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <app-vendas-card />
        <app-estoque-card />
        <app-fiscal-card />
      </div>
    </div>
  `,
})
export class Home {
  protected readonly currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
