import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Edit, LucideAngularModule, MapPin, Plus, Search, Trash2, Truck } from 'lucide-angular';
import { formatarDocumento } from '../lib/format';
import type { Fornecedor } from '../types';
import { ModalConfirmar } from './modal-confirmar';
import { FornecedorInput, ModalFornecedor } from './modal-fornecedor';

// Mock até a tela ser ligada ao back. Q10: assume cadastro próprio (CRUD) de fornecedor.
const fornecedoresIniciais: Fornecedor[] = [
  { id: 'forn-1', cnpj: '61586372000136', razaoSocial: 'Distribuidora Brasil Autopeças Ltda', ie: '110042490114', uf: 'SP' },
  { id: 'forn-2', cnpj: '33041260000164', razaoSocial: 'Filtros Nacionais S.A.', ie: '149626224113', uf: 'SP' },
  { id: 'forn-3', cnpj: '07526557000100', razaoSocial: 'Baterias do Sul Indústria Ltda', ie: '0960014240', uf: 'RS' },
  { id: 'forn-4', cnpj: '02558157000162', razaoSocial: 'Freios & Cia Comércio de Peças Ltda', ie: 'ISENTO', uf: 'MG' },
  { id: 'forn-5', cnpj: '17469701000177', razaoSocial: 'Amortecedores Paraná Ltda', ie: '9012345678', uf: 'PR' },
];

@Component({
  selector: 'app-fornecedores',
  imports: [FormsModule, LucideAngularModule, ModalFornecedor, ModalConfirmar],
  templateUrl: './fornecedores.html',
})
export class Fornecedores {
  protected readonly EditIcon = Edit;
  protected readonly MapPinIcon = MapPin;
  protected readonly PlusIcon = Plus;
  protected readonly SearchIcon = Search;
  protected readonly Trash2Icon = Trash2;
  protected readonly TruckIcon = Truck;

  protected readonly fornecedores = signal<Fornecedor[]>(fornecedoresIniciais);
  protected readonly busca = signal('');
  /** `null` = modal fechado; `'novo'` = cadastro; `Fornecedor` = edição. */
  protected readonly formulario = signal<'novo' | Fornecedor | null>(null);
  protected readonly excluindo = signal<Fornecedor | null>(null);

  protected readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const digitos = termo.replace(/\D/g, '');
    return this.fornecedores().filter(
      (f) =>
        !termo ||
        f.razaoSocial.toLowerCase().includes(termo) ||
        (digitos !== '' && f.cnpj.includes(digitos)),
    );
  });

  protected readonly totalUfs = computed(() => new Set(this.fornecedores().map((f) => f.uf)).size);

  protected formatarCnpj(cnpj: string): string {
    return formatarDocumento(cnpj);
  }

  /** Só o fornecedor em edição (nunca a string `'novo'`), para passar ao modal. */
  protected editando(): Fornecedor | null {
    const f = this.formulario();
    return f && f !== 'novo' ? f : null;
  }

  protected salvar(dados: FornecedorInput) {
    const dadosLimpos = { ...dados, cnpj: dados.cnpj.replace(/\D/g, '') };
    const atual = this.editando();
    if (atual) {
      this.fornecedores.update((lista) =>
        lista.map((f) => (f.id === atual.id ? { ...f, ...dadosLimpos } : f)),
      );
    } else {
      const id = crypto.randomUUID();
      this.fornecedores.update((lista) => [...lista, { id, ...dadosLimpos }]);
    }
    this.formulario.set(null);
  }

  protected confirmarExclusao() {
    const alvo = this.excluindo();
    if (alvo) this.fornecedores.update((lista) => lista.filter((f) => f.id !== alvo.id));
    this.excluindo.set(null);
  }
}
