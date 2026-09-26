import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Building2,
  Edit,
  LucideAngularModule,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from 'lucide-angular';
import { ClientesStore, NovoCliente } from '../core/clientes.store';
import { ModalNovoCliente } from './modal-novo-cliente';

const corClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, LucideAngularModule, ModalNovoCliente],
  templateUrl: './clientes.html',
})
export class Clientes {
  private readonly store = inject(ClientesStore);

  protected readonly Building2Icon = Building2;
  protected readonly EditIcon = Edit;
  protected readonly MailIcon = Mail;
  protected readonly MapPinIcon = MapPin;
  protected readonly PhoneIcon = Phone;
  protected readonly PlusIcon = Plus;
  protected readonly SearchIcon = Search;
  protected readonly Trash2Icon = Trash2;
  protected readonly UserIcon = User;
  protected readonly UsersIcon = Users;

  protected readonly filtroTipo = signal<'todos' | 'PF' | 'PJ'>('todos');
  protected readonly busca = signal('');
  protected readonly cadastrando = signal(false);

  protected readonly clientesFiltrados = computed(() =>
    this.store.clientes().filter((cliente) => {
      const busca = this.busca();
      const matchTipo = this.filtroTipo() === 'todos' || cliente.tipo === this.filtroTipo();
      const matchBusca =
        busca === '' ||
        cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.documento.includes(busca) ||
        cliente.email.toLowerCase().includes(busca.toLowerCase());
      return matchTipo && matchBusca;
    }),
  );

  protected readonly estatisticas = computed(() => {
    const lista = this.store.clientes();
    return [
      { label: 'Total de Clientes', valor: lista.length.toString(), icone: Users, cor: 'blue' },
      { label: 'Pessoa Física', valor: lista.filter((c) => c.tipo === 'PF').length.toString(), icone: User, cor: 'green' },
      { label: 'Pessoa Jurídica', valor: lista.filter((c) => c.tipo === 'PJ').length.toString(), icone: Building2, cor: 'purple' },
      { label: 'Clientes Ativos', valor: lista.filter((c) => c.status === 'ativo').length.toString(), icone: Users, cor: 'orange' },
    ];
  });

  protected cadastrar(dados: NovoCliente) {
    this.store.adicionar(dados);
    this.cadastrando.set(false);
  }

  protected classeCor(cor: string): string {
    return corClasses[cor as keyof typeof corClasses];
  }
}
