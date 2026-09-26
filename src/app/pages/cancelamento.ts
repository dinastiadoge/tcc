import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertTriangle, CheckCircle, Clock, LucideAngularModule, Search, XCircle } from 'lucide-angular';

interface NotaParaCancelar {
  id: number;
  numero: string;
  serie: string;
  cliente: string;
  valor: number;
  dataEmissao: string;
  chaveAcesso: string;
  status: 'autorizada' | 'cancelada';
}

const notas: NotaParaCancelar[] = [
  { id: 1, numero: '000126', serie: '1', cliente: 'Transportadora Rápida Ltda', valor: 3450.0, dataEmissao: '23/04/2026', chaveAcesso: '35260412345678000195550010001260001234567890', status: 'autorizada' },
  { id: 2, numero: '000125', serie: '1', cliente: 'Posto Central', valor: 780.0, dataEmissao: '23/04/2026', chaveAcesso: '35260498765432000111550010001250009876543210', status: 'autorizada' },
  { id: 3, numero: '000124', serie: '1', cliente: 'Retífica Souza Ltda', valor: 2890.0, dataEmissao: '23/04/2026', chaveAcesso: '35260445678901000123550010001240004567890120', status: 'autorizada' },
  { id: 4, numero: '000121', serie: '1', cliente: 'Caminhões e CIA', valor: 4120.0, dataEmissao: '22/04/2026', chaveAcesso: '35260456789012000189550010001210005678901230', status: 'cancelada' },
];

@Component({
  selector: 'app-cancelamento',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './cancelamento.html',
})
export class Cancelamento {
  protected readonly AlertTriangleIcon = AlertTriangle;
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly ClockIcon = Clock;
  protected readonly SearchIcon = Search;
  protected readonly XCircleIcon = XCircle;

  protected readonly busca = signal('');
  protected readonly notaSelecionada = signal<NotaParaCancelar | null>(null);
  protected readonly justificativa = signal('');
  protected readonly enviando = signal(false);
  protected readonly sucesso = signal(false);

  protected readonly notasFiltradas = computed(() =>
    notas.filter(
      (n) =>
        n.status === 'autorizada' &&
        (this.busca() === '' ||
          n.numero.includes(this.busca()) ||
          n.cliente.toLowerCase().includes(this.busca().toLowerCase())),
    ),
  );

  protected async handleCancelar() {
    if (this.justificativa().trim().length < 15) return;
    this.enviando.set(true);
    await new Promise((r) => setTimeout(r, 1200));
    this.enviando.set(false);
    this.sucesso.set(true);
    setTimeout(() => {
      this.sucesso.set(false);
      this.notaSelecionada.set(null);
      this.justificativa.set('');
    }, 2500);
  }
}
