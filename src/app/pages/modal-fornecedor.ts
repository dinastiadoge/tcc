import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { LucideAngularModule, Save, X } from 'lucide-angular';
import { mascararDocumento, validarCnpj } from '../lib/documento';
import { UFS } from '../lib/ufs';
import type { Fornecedor } from '../types';

export type FornecedorInput = Omit<Fornecedor, 'id'>;

/** Formulário de fornecedor (Q10): novo ou edição. `existentes` serve para barrar CNPJ repetido. */
@Component({
  selector: 'app-modal-fornecedor',
  imports: [LucideAngularModule],
  templateUrl: './modal-fornecedor.html',
})
export class ModalFornecedor implements OnInit {
  readonly fornecedor = input<Fornecedor | null>(null);
  readonly existentes = input<Fornecedor[]>([]);
  readonly salvar = output<FornecedorInput>();
  readonly fechar = output<void>();

  protected readonly XIcon = X;
  protected readonly SaveIcon = Save;
  protected readonly UFS = UFS;

  protected readonly cnpj = signal('');
  protected readonly razaoSocial = signal('');
  protected readonly ie = signal('');
  protected readonly uf = signal<string>('SP');
  protected readonly tentouSalvar = signal(false);

  protected readonly erros = computed(() => {
    const digitos = this.cnpj().replace(/\D/g, '');
    const editando = this.fornecedor();
    const repetido = this.existentes().some(
      (f) => f.id !== editando?.id && f.cnpj.replace(/\D/g, '') === digitos,
    );
    return {
      cnpj: !validarCnpj(this.cnpj()) ? 'Informe um CNPJ válido.' : repetido ? 'Já existe um fornecedor com este CNPJ.' : '',
      razaoSocial: this.razaoSocial().trim() ? '' : 'Informe a razão social.',
      ie: /^(isento|\d{2,14})?$/i.test(this.ie().trim()) ? '' : 'Use só números ou "ISENTO".',
    };
  });

  ngOnInit() {
    const f = this.fornecedor();
    if (!f) return;
    this.cnpj.set(mascararDocumento(f.cnpj));
    this.razaoSocial.set(f.razaoSocial);
    this.ie.set(f.ie);
    this.uf.set(f.uf);
  }

  protected texto(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected aoDigitarCnpj(event: Event) {
    const campo = event.target as HTMLInputElement;
    campo.value = mascararDocumento(campo.value);
    this.cnpj.set(campo.value);
  }

  protected handleSubmit(event: Event) {
    event.preventDefault();
    this.tentouSalvar.set(true);
    const erros = this.erros();
    if (erros.cnpj || erros.razaoSocial || erros.ie) return;
    this.salvar.emit({
      cnpj: this.cnpj(),
      razaoSocial: this.razaoSocial().trim(),
      ie: this.ie().trim().toUpperCase(),
      uf: this.uf(),
    });
  }
}
