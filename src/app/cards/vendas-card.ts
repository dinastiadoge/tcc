import { Component, computed, inject, signal } from '@angular/core';
import { Check, LucideAngularModule, Plus, Search, UserX } from 'lucide-angular';
import { ClientesStore, NovoCliente } from '../core/clientes.store';
import { mascararDocumento, tipoDocumentoPorDigitos, validarDocumento } from '../lib/documento';
import { ModalNovoCliente } from '../pages/modal-novo-cliente';

@Component({
  selector: 'app-vendas-card',
  imports: [LucideAngularModule, ModalNovoCliente],
  template: `
    <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 class="text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Vendas Ágeis</h2>

      <div class="space-y-3 sm:space-y-4">
        <div>
          <label for="documento-cliente" class="block text-xs sm:text-sm text-gray-700 mb-2">
            Buscar Cliente por CPF ou CNPJ
          </label>
          <div class="relative">
            <input
              id="documento-cliente"
              type="text"
              inputmode="numeric"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              [value]="documento()"
              (input)="aoDigitar($event)"
              [attr.aria-invalid]="situacao() === 'invalido' ? 'true' : null"
              class="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              [class]="situacao() === 'invalido' ? 'border-red-400' : 'border-gray-300'"
            />
            <lucide-icon [img]="SearchIcon" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          @switch (situacao()) {
            @case ('invalido') {
              <p class="mt-1.5 text-xs text-red-600">CPF ou CNPJ inválido. Confira os dígitos.</p>
            }
            @case ('encontrado') {
              <p class="mt-1.5 flex items-center gap-1.5 text-xs text-green-700">
                <lucide-icon [img]="CheckIcon" [size]="14" />
                {{ clienteEncontrado()?.nome }}
              </p>
            }
            @case ('nao-encontrado') {
              <div class="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg" role="status">
                <p class="flex items-center gap-1.5 text-sm text-amber-900">
                  <lucide-icon [img]="UserXIcon" [size]="16" />
                  Cliente não encontrado
                </p>
                <button
                  type="button"
                  (click)="cadastrando.set(true)"
                  class="mt-1.5 text-xs text-blue-700 hover:underline"
                >
                  Cadastrar cliente com este documento
                </button>
              </div>
            }
          }
        </div>

        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base">
          <lucide-icon [img]="PlusIcon" [size]="18" class="sm:w-5 sm:h-5" />
          <span>Novo Pedido/Nota Fiscal</span>
        </button>
      </div>
    </div>

    @if (cadastrando()) {
      <app-modal-novo-cliente
        [documentoInicial]="documento()"
        (salvar)="cadastrar($event)"
        (fechar)="cadastrando.set(false)"
      />
    }
  `,
})
export class VendasCard {
  private readonly clientes = inject(ClientesStore);

  protected readonly SearchIcon = Search;
  protected readonly PlusIcon = Plus;
  protected readonly CheckIcon = Check;
  protected readonly UserXIcon = UserX;

  protected readonly documento = signal('');
  protected readonly cadastrando = signal(false);

  protected readonly situacao = computed<'vazio' | 'digitando' | 'invalido' | 'encontrado' | 'nao-encontrado'>(() => {
    const documento = this.documento();
    if (!documento) return 'vazio';
    if (!tipoDocumentoPorDigitos(documento)) return 'digitando';
    // Cadastro existente vale antes da validação (os mocks têm documentos fictícios).
    if (this.clientes.buscarPorDocumento(documento)) return 'encontrado';
    return validarDocumento(documento) ? 'nao-encontrado' : 'invalido';
  });

  protected readonly clienteEncontrado = computed(() =>
    this.situacao() === 'encontrado' ? this.clientes.buscarPorDocumento(this.documento()) : undefined,
  );

  protected aoDigitar(event: Event) {
    const campo = event.target as HTMLInputElement;
    campo.value = mascararDocumento(campo.value);
    this.documento.set(campo.value);
  }

  protected cadastrar(dados: NovoCliente) {
    this.clientes.adicionar(dados);
    this.cadastrando.set(false);
  }
}
