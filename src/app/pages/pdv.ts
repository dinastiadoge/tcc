import { afterNextRender, Component, computed, Directive, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Banknote,
  Building,
  Check,
  CreditCard,
  DollarSign,
  Edit3,
  LucideAngularModule,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  User,
  UserX,
  Vault,
  X,
} from 'lucide-angular';
import { ClientesStore, NovoCliente } from '../core/clientes.store';
import { mascararDocumento, tipoDocumentoPorDigitos, validarDocumento } from '../lib/documento';
import { ModalNovoCliente } from './modal-novo-cliente';

interface ItemCarrinho {
  id: number;
  codigo: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  editandoPreco: boolean;
  precoTemp: string;
}

type TipoDocumento = 'nfe' | 'nfce';
type Modalidade = 'fisica' | 'virtual';
type DestinoMoeda = 'banco' | 'cofre';
type MetodoPagamento = 'dinheiro' | 'credito' | 'debito' | 'pix' | 'boleto';
type BandeiraCartao = 'mastercard' | 'visa' | 'elo' | 'outros';
type EstadoCliente = 'vazio' | 'digitando' | 'invalido' | 'so-cpf' | 'encontrado' | 'nao-encontrado';

/** Dá foco ao elemento assim que ele é renderizado (equivale ao `autoFocus` do React). */
@Directive({ selector: '[appAutofocus]' })
export class Autofocus {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef);
    afterNextRender(() => el.nativeElement.focus());
  }
}

@Component({
  selector: 'app-pdv',
  imports: [FormsModule, LucideAngularModule, Autofocus, ModalNovoCliente],
  templateUrl: './pdv.html',
})
export class PDV {
  private readonly clientes = inject(ClientesStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly CheckIcon = Check;
  protected readonly BuildingIcon = Building;
  protected readonly DollarSignIcon = DollarSign;
  protected readonly Edit3Icon = Edit3;
  protected readonly PlusIcon = Plus;
  protected readonly PrinterIcon = Printer;
  protected readonly SearchIcon = Search;
  protected readonly ShoppingCartIcon = ShoppingCart;
  protected readonly Trash2Icon = Trash2;
  protected readonly UserIcon = User;
  protected readonly UserXIcon = UserX;
  protected readonly VaultIcon = Vault;
  protected readonly XIcon = X;

  protected readonly BANDEIRAS: { value: BandeiraCartao; label: string }[] = [
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'visa', label: 'Visa' },
    { value: 'elo', label: 'Elo' },
    { value: 'outros', label: 'Outros' },
  ];

  protected readonly formasPagamento = [
    { value: 'dinheiro', label: 'Dinheiro', icone: Banknote },
    { value: 'credito', label: 'Crédito', icone: CreditCard },
    { value: 'debito', label: 'Débito', icone: CreditCard },
    { value: 'pix', label: 'PIX', icone: DollarSign },
    { value: 'boleto', label: 'Boleto', icone: null },
  ] as const;

  protected readonly tipoDocumento = signal<TipoDocumento>('nfe');
  protected readonly consumidorIdentificado = signal(true);

  // Cliente (Q8): busca por CPF/CNPJ; se não existir, cadastra na hora ou segue só com o nome digitado.
  protected readonly documento = signal('');
  protected readonly nomeDigitado = signal('');
  protected readonly seguirSemCadastro = signal(false);
  protected readonly cadastrando = signal(false);

  protected readonly estadoCliente = computed<EstadoCliente>(() => {
    const documento = this.documento();
    if (!documento) return 'vazio';
    const tipo = tipoDocumentoPorDigitos(documento);
    if (!tipo) return 'digitando';
    if (this.tipoDocumento() === 'nfce' && tipo === 'cnpj') return 'so-cpf';
    // Cadastro existente vale antes da validação (os mocks têm documentos fictícios).
    if (this.clientes.buscarPorDocumento(documento)) return 'encontrado';
    return validarDocumento(documento) ? 'nao-encontrado' : 'invalido';
  });

  protected readonly clienteEncontrado = computed(() =>
    this.estadoCliente() === 'encontrado'
      ? (this.clientes.buscarPorDocumento(this.documento()) ?? null)
      : null,
  );

  protected readonly nomeExibido = computed(() => this.clienteEncontrado()?.nome ?? this.nomeDigitado());
  protected readonly carrinho = signal<ItemCarrinho[]>([
    {
      id: 1,
      codigo: 'PF-001',
      nome: 'Pastilha de Freio Dianteira',
      quantidade: 2,
      valorUnitario: 125.0,
      editandoPreco: false,
      precoTemp: '125.00',
    },
    {
      id: 2,
      codigo: 'FO-023',
      nome: 'Filtro de Óleo Motor',
      quantidade: 1,
      valorUnitario: 45.9,
      editandoPreco: false,
      precoTemp: '45.90',
    },
  ]);

  protected readonly modalidade = signal<Modalidade>('fisica');
  protected readonly metodoPagamento = signal<MetodoPagamento>('dinheiro');
  protected readonly bandeira = signal<BandeiraCartao>('visa');
  protected readonly destinoMoeda = signal<DestinoMoeda>('banco');
  protected readonly desconto = signal(0);

  protected readonly subtotal = computed(() =>
    this.carrinho().reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0),
  );
  protected readonly total = computed(() => this.subtotal() - this.desconto());
  protected readonly usaCartao = computed(
    () => this.metodoPagamento() === 'credito' || this.metodoPagamento() === 'debito',
  );

  constructor() {
    // H11: chegando da Home com "Novo Pedido/Nota Fiscal" e o cliente já achado (?clienteId=).
    const clienteId = Number(this.route.snapshot.queryParamMap.get('clienteId'));
    const cliente = clienteId ? this.clientes.buscarPorId(clienteId) : undefined;
    if (cliente) this.documento.set(mascararDocumento(cliente.documento));
  }

  protected aoDigitarDocumento(event: Event) {
    const campo = event.target as HTMLInputElement;
    campo.value = mascararDocumento(campo.value);
    this.documento.set(campo.value);
    this.seguirSemCadastro.set(false);
  }

  protected aoDigitarNome(event: Event) {
    this.nomeDigitado.set((event.target as HTMLInputElement).value);
  }

  protected cadastrarCliente(dados: NovoCliente) {
    this.clientes.adicionar(dados);
    this.cadastrando.set(false);
  }

  private atualizarItem(id: number, mudar: (item: ItemCarrinho) => ItemCarrinho) {
    this.carrinho.update((lista) => lista.map((item) => (item.id === id ? mudar(item) : item)));
  }

  protected removerItem(id: number) {
    this.carrinho.update((lista) => lista.filter((item) => item.id !== id));
  }

  protected atualizarQuantidade(id: number, event: Event) {
    const campo = event.target as HTMLInputElement;
    const novaQuantidade = parseInt(campo.value) || 1;
    campo.value = String(novaQuantidade);
    if (novaQuantidade < 1) return;
    this.atualizarItem(id, (item) => ({ ...item, quantidade: novaQuantidade }));
  }

  protected iniciarEdicaoPreco(id: number) {
    this.atualizarItem(id, (item) => ({
      ...item,
      editandoPreco: true,
      precoTemp: item.valorUnitario.toFixed(2),
    }));
  }

  protected atualizarPrecoTemp(id: number, event: Event) {
    const precoTemp = (event.target as HTMLInputElement).value;
    this.atualizarItem(id, (item) => ({ ...item, precoTemp }));
  }

  protected confirmarEdicaoPreco(id: number) {
    this.atualizarItem(id, (item) => {
      const novoValor = parseFloat(item.precoTemp.replace(',', '.')) || item.valorUnitario;
      return { ...item, valorUnitario: novoValor, editandoPreco: false };
    });
  }

  protected cancelarEdicaoPreco(id: number) {
    this.atualizarItem(id, (item) => ({
      ...item,
      editandoPreco: false,
      precoTemp: item.valorUnitario.toFixed(2),
    }));
  }

  protected atualizarDesconto(event: Event) {
    const valor = parseFloat((event.target as HTMLInputElement).value) || 0;
    this.desconto.set(Math.max(0, valor));
  }
}
