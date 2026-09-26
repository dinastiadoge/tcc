import { Component } from '@angular/core';
import { Archive, Download, FileText, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-fiscal-card',
  imports: [LucideAngularModule],
  template: `
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div class="flex items-center gap-2 mb-3 sm:mb-4">
        <lucide-icon [img]="FileTextIcon" [size]="20" class="text-blue-600" />
        <h2 class="text-base sm:text-lg text-gray-900">Ações Fiscais</h2>
      </div>

      <div class="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        @for (nota of notasEmitidas; track nota.id) {
          <div class="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-xs sm:text-sm text-gray-900">NF-e {{ nota.numero }}</span>
                <span class="text-xs text-gray-500">{{ nota.hora }}</span>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 truncate mt-0.5">{{ nota.cliente }}</p>
            </div>
            <div class="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              <span class="text-xs sm:text-sm text-green-600 mr-1 sm:mr-2 hidden sm:inline">{{ nota.valor }}</span>
              <button class="p-1 sm:p-1.5 hover:bg-white rounded transition-colors" title="Baixar XML">
                <lucide-icon [img]="DownloadIcon" [size]="14" class="text-gray-600 sm:w-4 sm:h-4" />
              </button>
              <button class="p-1 sm:p-1.5 hover:bg-white rounded transition-colors" title="Baixar PDF">
                <lucide-icon [img]="FileTextIcon" [size]="14" class="text-gray-600 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        }
      </div>

      <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
        <lucide-icon [img]="ArchiveIcon" [size]="18" class="sm:w-5 sm:h-5" />
        <span>Enviar lote para Contador</span>
      </button>
    </div>
  `,
})
export class FiscalCard {
  protected readonly FileTextIcon = FileText;
  protected readonly DownloadIcon = Download;
  protected readonly ArchiveIcon = Archive;

  protected readonly notasEmitidas = [
    { id: 1, numero: '000123', cliente: 'Auto Mecânica Silva', valor: 'R$ 1.250,00', hora: '09:15' },
    { id: 2, numero: '000124', cliente: 'Retífica Souza Ltda', valor: 'R$ 2.890,00', hora: '10:32' },
    { id: 3, numero: '000125', cliente: 'Posto Central', valor: 'R$ 780,00', hora: '11:45' },
    { id: 4, numero: '000126', cliente: 'Transportadora Rápida', valor: 'R$ 3.450,00', hora: '14:20' },
  ];
}
