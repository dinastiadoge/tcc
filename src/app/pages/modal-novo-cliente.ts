import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { LucideAngularModule, Save, X } from 'lucide-angular';
import type { NovoCliente } from '../core/clientes.store';
import { mascararDocumento, tipoDocumentoPorDigitos, validarDocumento } from '../lib/documento';
import { UFS } from '../lib/ufs';

function mascararTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const corte = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
}

const EMAIL =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Cadastro rápido de cliente (Q8): usado no PDV, na Home e na tela de Clientes. */
@Component({
  selector: 'app-modal-novo-cliente',
  imports: [LucideAngularModule],
  templateUrl: './modal-novo-cliente.html',
})
export class ModalNovoCliente implements OnInit {
  /** Documento já digitado na busca (o cadastro nasce com ele preenchido). */
  readonly documentoInicial = input('');
  readonly salvar = output<NovoCliente>();
  readonly fechar = output<void>();

  protected readonly XIcon = X;
  protected readonly SaveIcon = Save;
  protected readonly UFS = UFS;

  protected readonly documento = signal('');
  protected readonly nome = signal('');
  protected readonly email = signal('');
  protected readonly telefone = signal('');
  protected readonly cidade = signal('');
  protected readonly uf = signal<string>('SP');
  protected readonly tentouSalvar = signal(false);

  protected readonly tipo = computed<'PF' | 'PJ' | null>(() => {
    const t = tipoDocumentoPorDigitos(this.documento());
    return t === 'cpf' ? 'PF' : t === 'cnpj' ? 'PJ' : null;
  });

  protected readonly erros = computed(() => ({
    documento: validarDocumento(this.documento()) ? '' : 'Informe um CPF ou CNPJ válido.',
    nome: this.nome().trim() ? '' : 'Informe o nome ou a razão social.',
    email: !this.email().trim() || EMAIL.test(this.email().trim()) ? '' : 'E-mail inválido.',
  }));

  ngOnInit() {
    this.documento.set(mascararDocumento(this.documentoInicial()));
  }

  protected texto(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected aoDigitarDocumento(event: Event) {
    const campo = event.target as HTMLInputElement;
    campo.value = mascararDocumento(campo.value);
    this.documento.set(campo.value);
  }

  protected aoDigitarTelefone(event: Event) {
    const campo = event.target as HTMLInputElement;
    campo.value = mascararTelefone(campo.value);
    this.telefone.set(campo.value);
  }

  protected handleSubmit(event: Event) {
    event.preventDefault();
    this.tentouSalvar.set(true);
    const tipo = this.tipo();
    const erros = this.erros();
    if (!tipo || erros.documento || erros.nome || erros.email) return;
    this.salvar.emit({
      tipo,
      documento: this.documento(),
      nome: this.nome().trim(),
      email: this.email().trim(),
      telefone: this.telefone(),
      cidade: this.cidade().trim(),
      uf: this.uf(),
    });
  }
}
