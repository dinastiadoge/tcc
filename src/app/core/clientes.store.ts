import { Injectable, signal } from '@angular/core';
import { formatarDocumento, formatarTelefone } from '../lib/format';

export interface Cliente {
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

export type NovoCliente = Pick<Cliente, 'tipo' | 'documento' | 'nome' | 'email' | 'telefone' | 'cidade' | 'uf'>;

const clientesIniciais: Cliente[] = [
  { id: 1, tipo: 'PJ', documento: '12.345.678/0001-90', nome: 'Transportadora Rápida Ltda', email: 'contato@rapidaltda.com', telefone: '(11) 3456-7890', cidade: 'São Paulo', uf: 'SP', totalCompras: 15, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 2, tipo: 'PJ', documento: '98.765.432/0001-11', nome: 'Posto Central', email: 'posto@central.com.br', telefone: '(11) 2345-6789', cidade: 'Guarulhos', uf: 'SP', totalCompras: 42, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 3, tipo: 'PJ', documento: '45.678.901/0001-23', nome: 'Retífica Souza Ltda', email: 'retifica@souza.com', telefone: '(11) 4567-8901', cidade: 'São Paulo', uf: 'SP', totalCompras: 28, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 4, tipo: 'PF', documento: '123.456.789-00', nome: 'João Silva', email: 'joao.silva@email.com', telefone: '(11) 98765-4321', cidade: 'São Paulo', uf: 'SP', totalCompras: 8, ultimaCompra: '22/04/2026', status: 'ativo' },
  { id: 5, tipo: 'PJ', documento: '23.456.789/0001-45', nome: 'Auto Mecânica Silva', email: 'mecanica@silva.com.br', telefone: '(11) 3789-0123', cidade: 'Osasco', uf: 'SP', totalCompras: 35, ultimaCompra: '23/04/2026', status: 'ativo' },
  { id: 6, tipo: 'PF', documento: '234.567.890-11', nome: 'Maria Santos', email: 'maria.santos@email.com', telefone: '(11) 97654-3210', cidade: 'São Paulo', uf: 'SP', totalCompras: 5, ultimaCompra: '21/04/2026', status: 'ativo' },
  { id: 7, tipo: 'PJ', documento: '34.567.890/0001-67', nome: 'Oficina do João', email: 'oficina@joao.com', telefone: '(11) 2890-1234', cidade: 'Barueri', uf: 'SP', totalCompras: 19, ultimaCompra: '22/04/2026', status: 'ativo' },
  { id: 8, tipo: 'PF', documento: '345.678.901-22', nome: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', telefone: '(11) 96543-2109', cidade: 'São Paulo', uf: 'SP', totalCompras: 3, ultimaCompra: '20/04/2026', status: 'inativo' },
];

const soDigitos = (valor: string): string => valor.replace(/\D/g, '');

/**
 * Lista de clientes compartilhada entre Clientes, PDV e Home (mock, até a H3 ligar o back).
 * Q8: assume que o front pode cadastrar na hora (`POST /clientes`); hoje só acrescenta na lista.
 */
@Injectable({ providedIn: 'root' })
export class ClientesStore {
  readonly clientes = signal<Cliente[]>(clientesIniciais);

  buscarPorDocumento(documento: string): Cliente | undefined {
    const digitos = soDigitos(documento);
    return this.clientes().find((c) => soDigitos(c.documento) === digitos);
  }

  adicionar(dados: NovoCliente): Cliente {
    const cliente: Cliente = {
      ...dados,
      documento: formatarDocumento(dados.documento),
      telefone: formatarTelefone(dados.telefone),
      id: Math.max(0, ...this.clientes().map((c) => c.id)) + 1,
      totalCompras: 0,
      ultimaCompra: '—',
      status: 'ativo',
    };
    this.clientes.update((lista) => [...lista, cliente]);
    return cliente;
  }
}
