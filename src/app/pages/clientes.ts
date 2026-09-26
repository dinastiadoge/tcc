import { Component, computed, signal } from '@angular/core';
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

interface Cliente {
  id: number;
  tipo: 'PF' | 'PJ';
  documento: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  totalCompras: number;
  ultimaCompra: string;
  status: 'ativo' | 'inativo';
}

const clientesData: Cliente[] = [
  { id: 1, tipo: 'PJ', documento: '12.345.678/0001-90', nome: 'Transportadora Rápida Ltda', email: 'contato@rapidaltda.com', telefone: '(11) 3456-7890', cidade: 'São Paulo', uf: 'SP', totalCompras: 15, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 2, tipo: 'PJ', documento: '98.765.432/0001-11', nome: 'Posto Central', email: 'posto@central.com.br', telefone: '(11) 2345-6789', cidade: 'Guarulhos', uf: 'SP', totalCompras: 42, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 3, tipo: 'PJ', documento: '45.678.901/0001-23', nome: 'Retífica Souza Ltda', email: 'retifica@souza.com', telefone: '(11) 4567-8901', cidade: 'São Paulo', uf: 'SP', totalCompras: 28, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 4, tipo: 'PF', documento: '123.456.789-00', nome: 'João Silva', email: 'joao.silva@email.com', telefone: '(11) 98765-4321', cidade: 'São Paulo', uf: 'SP', totalCompras: 8, ultimaCompra: '22/04/2026', status: 'ativo' },
  { id: 5, tipo: 'PJ', documento: '23.456.789/0001-45', nome: 'Auto Mecânica Silva', email: 'mecanica@silva.com.br', telefone: '(11) 3789-0123', cidade: 'Osasco', uf: 'SP', totalCompras: 35, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 6, tipo: 'PF', documento: '234.567.890-11', nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '(11) 97654-3210', cidade: 'São Paulo', uf: 'SP', totalCompras: 5, ultimaCompra: '21/04/2026', status: 'ativo' },
  { id: 7, tipo: 'PJ', documento: '34.567.890/0001-67', nome: 'Oficina do João', email: 'oficina@joao.com', telefone: '(11) 2890-1234', cidade: 'Barueri', uf: 'SP', totalCompras: 19, ultimaCompra: '22/04/2026', status: 'ativo' },
  { id: 8, tipo: 'PF', documento: '345.678.901-22', nome: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', telefone: '(11) 96543-2109', cidade: 'São Paulo', uf: 'SP', totalCompras: 3, ultimaCompra: '20/04/2026', status: 'inativo' },
];

const corClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './clientes.html',
})
export class Clientes {
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

  protected readonly clientesFiltrados = computed(() =>
    clientesData.filter((cliente) => {
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

  private readonly totalPF = clientesData.filter((c) => c.tipo === 'PF').length;
  private readonly totalPJ = clientesData.filter((c) => c.tipo === 'PJ').length;
  private readonly totalAtivos = clientesData.filter((c) => c.status === 'ativo').length;

  protected readonly estatisticas = [
    { label: 'Total de Clientes', valor: clientesData.length.toString(), icone: Users, cor: 'blue' },
    { label: 'Pessoa Física', valor: this.totalPF.toString(), icone: User, cor: 'green' },
    { label: 'Pessoa Jurídica', valor: this.totalPJ.toString(), icone: Building2, cor: 'purple' },
    { label: 'Clientes Ativos', valor: this.totalAtivos.toString(), icone: Users, cor: 'orange' },
  ];

  protected classeCor(cor: string): string {
    return corClasses[cor as keyof typeof corClasses];
  }
}
