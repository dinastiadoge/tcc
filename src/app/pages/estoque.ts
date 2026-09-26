import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertTriangle,
  Edit,
  LucideAngularModule,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-angular';
import { ModalEditarProduto } from './modal-editar-produto';

export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  ncm: string;
  estoque: number;
  minimo: number;
  custo: number;
  venda: number;
  status: string;
}

const produtosIniciais: Produto[] = [
  { id: 1, codigo: 'PF-001', nome: 'Pastilha de Freio Dianteira', ncm: '8708.30.10', estoque: 45, minimo: 20, custo: 85.0, venda: 125.0, status: 'ok' },
  { id: 2, codigo: 'FO-023', nome: 'Filtro de Óleo Motor', ncm: '8421.23.00', estoque: 5, minimo: 15, custo: 28.0, venda: 45.9, status: 'baixo' },
  { id: 3, codigo: 'CD-045', nome: 'Correia Dentada', ncm: '4010.35.00', estoque: 8, minimo: 10, custo: 120.0, venda: 189.9, status: 'baixo' },
  { id: 4, codigo: 'VI-012', nome: 'Vela de Ignição', ncm: '8511.10.00', estoque: 12, minimo: 10, custo: 18.0, venda: 32.9, status: 'atencao' },
  { id: 5, codigo: 'LH-089', nome: 'Lâmpada H4 12V', ncm: '8539.21.00', estoque: 67, minimo: 30, custo: 12.0, venda: 24.9, status: 'ok' },
  { id: 6, codigo: 'BA-034', nome: 'Bateria 60Ah', ncm: '8507.10.00', estoque: 3, minimo: 8, custo: 280.0, venda: 459.0, status: 'critico' },
  { id: 7, codigo: 'AM-078', nome: 'Amortecedor Dianteiro', ncm: '8708.80.00', estoque: 22, minimo: 12, custo: 195.0, venda: 329.9, status: 'ok' },
  { id: 8, codigo: 'DI-056', nome: 'Disco de Freio', ncm: '8708.30.10', estoque: 18, minimo: 15, custo: 145.0, venda: 239.9, status: 'atencao' },
];

const corClasses = {
  blue: 'bg-blue-100 text-blue-600',
  orange: 'bg-orange-100 text-orange-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
};

@Component({
  selector: 'app-estoque',
  imports: [FormsModule, LucideAngularModule, ModalEditarProduto],
  templateUrl: './estoque.html',
})
export class Estoque {
  protected readonly SearchIcon = Search;
  protected readonly PlusIcon = Plus;
  protected readonly EditIcon = Edit;
  protected readonly Trash2Icon = Trash2;

  protected readonly estatisticas = [
    { label: 'Total de Produtos', valor: '847', icone: Package, cor: 'blue' },
    { label: 'Estoque Baixo', valor: '23', icone: AlertTriangle, cor: 'orange' },
    { label: 'Valor em Estoque', valor: 'R$ 145.890', icone: TrendingUp, cor: 'green' },
    { label: 'Itens Críticos', valor: '8', icone: TrendingDown, cor: 'red' },
  ];

  protected readonly produtos = signal<Produto[]>(produtosIniciais);
  protected readonly busca = signal('');
  protected readonly produtoEditando = signal<Produto | null>(null);

  protected readonly produtosFiltrados = computed(() =>
    this.produtos().filter(
      (p) =>
        this.busca() === '' ||
        p.nome.toLowerCase().includes(this.busca().toLowerCase()) ||
        p.codigo.toLowerCase().includes(this.busca().toLowerCase()),
    ),
  );

  protected classeCor(cor: string): string {
    return corClasses[cor as keyof typeof corClasses];
  }

  protected salvarProduto(produtoAtualizado: Produto) {
    const estoque = produtoAtualizado.estoque;
    const minimo = produtoAtualizado.minimo;
    let status = 'ok';
    if (estoque <= minimo * 0.4) status = 'critico';
    else if (estoque < minimo * 0.7) status = 'baixo';
    else if (estoque < minimo) status = 'atencao';

    this.produtos.update((lista) =>
      lista.map((p) => (p.id === produtoAtualizado.id ? { ...produtoAtualizado, status } : p)),
    );
    this.produtoEditando.set(null);
  }
}
