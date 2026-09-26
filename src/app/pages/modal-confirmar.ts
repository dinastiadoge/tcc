import { Component, input, output } from '@angular/core';
import { AlertTriangle, LucideAngularModule } from 'lucide-angular';

/** Confirmação de ação destrutiva (exclusões sempre passam por aqui, ver H14). */
@Component({
  selector: 'app-modal-confirmar',
  imports: [LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="titulo-confirmar">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-5">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
            <lucide-icon [img]="AlertIcon" [size]="20" />
          </div>
          <div>
            <h3 id="titulo-confirmar" class="text-lg text-gray-900">{{ titulo() }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ mensagem() }}</p>
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button
            type="button"
            (click)="cancelar.emit()"
            class="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirmar.emit()"
            class="flex-1 px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            {{ rotuloConfirmar() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ModalConfirmar {
  readonly titulo = input.required<string>();
  readonly mensagem = input.required<string>();
  readonly rotuloConfirmar = input('Excluir');
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  protected readonly AlertIcon = AlertTriangle;
}
