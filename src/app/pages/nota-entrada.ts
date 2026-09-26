import { Component, computed, signal } from '@angular/core';
import {
  CheckCircle,
  Clock,
  LucideAngularModule,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-angular';

interface ItemEntrada {
  id: number;
  codigo: string;
  descricao: string;
  ncm: string;
  quantidade: number;
  valorUnitario: number;
  cfop: string;
}

@Component({
  selector: 'app-nota-entrada',
  imports: [LucideAngularModule],
  templateUrl: './nota-entrada.html',
})
export class NotaEntrada {
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly ClockIcon = Clock;
  protected readonly PackagePlusIcon = PackagePlus;
  protected readonly PlusIcon = Plus;
  protected readonly SearchIcon = Search;
  protected readonly Trash2Icon = Trash2;
  protected readonly UploadIcon = Upload;

  protected readonly cfopOpcoes = ['1102', '1202', '1403', '1411', '2102', '2202'];
  protected readonly ufs = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];

  protected readonly fornecedor = signal({
    cnpj: '',
    razaoSocial: '',
    ie: '',
    uf: 'SP',
  });
  protected readonly nota = signal({
    numero: '',
    serie: '1',
    dataEmissao: '',
    dataEntrada: new Date().toISOString().split('T')[0],
    chaveAcesso: '',
    naturezaOperacao: 'Compra para comercialização',
  });
  protected readonly itens = signal<ItemEntrada[]>([
    { id: 1, codigo: 'PF-001', descricao: 'Pastilha de Freio Dianteira', ncm: '8708.30.10', quantidade: 20, valorUnitario: 85.0, cfop: '1102' },
  ]);
  protected readonly enviando = signal(false);
  protected readonly sucesso = signal(false);

  protected readonly totalNota = computed(() =>
    this.itens().reduce((acc, i) => acc + i.quantidade * i.valorUnitario, 0),
  );

  protected setForn(field: string, value: string) {
    this.fornecedor.update((prev) => ({ ...prev, [field]: value }));
  }

  protected setNot(field: string, value: string) {
    this.nota.update((prev) => ({ ...prev, [field]: value }));
  }

  protected addItem() {
    this.itens.update((lista) => [
      ...lista,
      {
        id: Date.now(),
        codigo: '',
        descricao: '',
        ncm: '',
        quantidade: 1,
        valorUnitario: 0,
        cfop: '1102',
      },
    ]);
  }

  protected updateItem(id: number, field: string, value: string | number) {
    this.itens.update((lista) => lista.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  protected removeItem(id: number) {
    this.itens.update((lista) => lista.filter((i) => i.id !== id));
  }

  protected texto(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected inteiro(event: Event): number {
    return parseInt(this.texto(event)) || 1;
  }

  protected decimal(event: Event): number {
    return parseFloat(this.texto(event)) || 0;
  }

  protected async handleSalvar() {
    this.enviando.set(true);
    await new Promise((r) => setTimeout(r, 1200));
    this.enviando.set(false);
    this.sucesso.set(true);
    setTimeout(() => this.sucesso.set(false), 3000);
  }
}
