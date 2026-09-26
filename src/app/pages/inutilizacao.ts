import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertTriangle, Archive, CheckCircle, Clock, LucideAngularModule } from 'lucide-angular';

const FORM_INICIAL = {
  serie: '1',
  numeroInicial: '',
  numeroFinal: '',
  justificativa: '',
};

@Component({
  selector: 'app-inutilizacao',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './inutilizacao.html',
})
export class Inutilizacao {
  protected readonly AlertTriangleIcon = AlertTriangle;
  protected readonly ArchiveIcon = Archive;
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly ClockIcon = Clock;

  protected readonly form = signal({ ...FORM_INICIAL });
  protected readonly enviando = signal(false);
  protected readonly sucesso = signal(false);
  protected readonly erro = signal('');

  protected readonly inutilizacoes = [
    { id: 1, serie: '1', inicio: '000110', fim: '000115', data: '20/04/2026', motivo: 'Erro de emissão durante queda de sistema', status: 'inutilizada' },
    { id: 2, serie: '1', inicio: '000098', fim: '000098', data: '10/03/2026', motivo: 'Numeração pulada por falha no sistema', status: 'inutilizada' },
  ];

  protected set(field: keyof typeof FORM_INICIAL, value: string | number | null) {
    this.form.update((prev) => ({ ...prev, [field]: value === null ? '' : String(value) }));
  }

  /** Faixa válida: número final maior ou igual ao inicial. */
  protected readonly faixaValida = computed(() => {
    const f = this.form();
    return !!f.numeroInicial && !!f.numeroFinal && parseInt(f.numeroFinal) >= parseInt(f.numeroInicial);
  });

  protected readonly quantidade = computed(
    () => parseInt(this.form().numeroFinal) - parseInt(this.form().numeroInicial) + 1,
  );

  protected readonly isValid = computed(() => {
    const f = this.form();
    return !!f.serie && this.faixaValida() && f.justificativa.trim().length >= 15;
  });

  protected async handleSubmit() {
    if (!this.isValid()) return;
    this.erro.set('');
    this.enviando.set(true);
    await new Promise((r) => setTimeout(r, 1200));
    this.enviando.set(false);
    this.sucesso.set(true);
    setTimeout(() => {
      this.sucesso.set(false);
      this.form.set({ ...FORM_INICIAL });
    }, 3000);
  }
}
