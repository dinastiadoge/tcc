import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CheckCircle,
  Clock,
  LucideAngularModule,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-angular';

interface ItemDevolucao {
  id: number;
  codigo: string;
  nome: string;
  qtdOriginal: number;
  qtdDevolver: number;
  valorUnitario: number;
}

const notasReferencia = [
  { numero: '000126', serie: '1', cliente: 'Transportadora Rápida Ltda', cnpj: '12.345.678/0001-90', valor: 3450.0, data: '23/04/2026' },
  { numero: '000125', serie: '1', cliente: 'Posto Central', cnpj: '98.765.432/0001-11', valor: 780.0, data: '23/04/2026' },
  { numero: '000124', serie: '1', cliente: 'Retífica Souza Ltda', cnpj: '45.678.901/0001-23', valor: 2890.0, data: '23/04/2026' },
];

type NotaReferencia = (typeof notasReferencia)[0];

const itensMock: ItemDevolucao[] = [
  { id: 1, codigo: 'PF-001', nome: 'Pastilha de Freio Dianteira', qtdOriginal: 4, qtdDevolver: 2, valorUnitario: 125.0 },
  { id: 2, codigo: 'FO-023', nome: 'Filtro de Óleo Motor', qtdOriginal: 2, qtdDevolver: 1, valorUnitario: 45.9 },
];

@Component({
  selector: 'app-nota-devolucao',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './nota-devolucao.html',
})
export class NotaDevolucao {
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly ClockIcon = Clock;
  protected readonly PlusIcon = Plus;
  protected readonly RotateCcwIcon = RotateCcw;
  protected readonly SearchIcon = Search;
  protected readonly Trash2Icon = Trash2;

  protected readonly busca = signal('');
  protected readonly notaRef = signal<NotaReferencia | null>(null);
  protected readonly itens = signal<ItemDevolucao[]>([]);
  protected readonly motivo = signal('');
  protected readonly enviando = signal(false);
  protected readonly sucesso = signal(false);

  protected readonly notasFiltradas = computed(() =>
    notasReferencia.filter(
      (n) =>
        this.busca() === '' ||
        n.numero.includes(this.busca()) ||
        n.cliente.toLowerCase().includes(this.busca().toLowerCase()),
    ),
  );

  protected readonly totalDevolucao = computed(() =>
    this.itens().reduce((acc, i) => acc + i.qtdDevolver * i.valorUnitario, 0),
  );

  protected selecionarNota(nota: NotaReferencia) {
    this.notaRef.set(nota);
    this.itens.set(itensMock.map((i) => ({ ...i })));
  }

  protected trocarNota() {
    this.notaRef.set(null);
    this.itens.set([]);
  }

  /** Mantém a quantidade entre 0 e a original, também no que o campo exibe. */
  protected atualizarQtd(id: number, event: Event) {
    const campo = event.target as HTMLInputElement;
    const item = this.itens().find((i) => i.id === id);
    if (!item) return;
    const qtd = Math.max(0, Math.min(parseInt(campo.value) || 0, item.qtdOriginal));
    campo.value = String(qtd);
    this.itens.update((lista) => lista.map((i) => (i.id === id ? { ...i, qtdDevolver: qtd } : i)));
  }

  protected removerItem(id: number) {
    this.itens.update((lista) => lista.filter((i) => i.id !== id));
  }

  protected async handleEmitir() {
    this.enviando.set(true);
    await new Promise((r) => setTimeout(r, 1400));
    this.enviando.set(false);
    this.sucesso.set(true);
    setTimeout(() => {
      this.sucesso.set(false);
      this.notaRef.set(null);
      this.itens.set([]);
      this.motivo.set('');
      this.busca.set('');
    }, 2500);
  }
}
