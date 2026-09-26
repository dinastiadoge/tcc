import { Component, input, linkedSignal, output } from '@angular/core';
import { LucideAngularModule, Save, X } from 'lucide-angular';
import type { Produto } from './estoque';

@Component({
  selector: 'app-modal-editar-produto',
  imports: [LucideAngularModule],
  templateUrl: './modal-editar-produto.html',
})
export class ModalEditarProduto {
  readonly produto = input.required<Produto>();
  readonly salvar = output<Produto>();
  readonly fechar = output<void>();

  protected readonly XIcon = X;
  protected readonly SaveIcon = Save;

  protected readonly form = linkedSignal<Produto>(() => ({ ...this.produto() }));

  protected set(field: keyof Produto, value: string | number) {
    this.form.update((prev) => ({ ...prev, [field]: value }));
  }

  protected texto(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected inteiro(event: Event): number {
    return parseInt(this.texto(event)) || 0;
  }

  protected decimal(event: Event): number {
    return parseFloat(this.texto(event)) || 0;
  }

  protected handleSubmit(event: Event) {
    event.preventDefault();
    this.salvar.emit(this.form());
  }
}
