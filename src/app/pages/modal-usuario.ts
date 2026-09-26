import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { LucideAngularModule, Save, X } from 'lucide-angular';
import type { GrupoAcesso } from '../types';

export interface UsuarioLista {
  id: number;
  nome: string;
  email: string;
  grupo: GrupoAcesso;
  ativo: boolean;
  ultimoAcesso: string;
}

export interface UsuarioInput {
  nome: string;
  email: string;
  /** Vazio na edição = manter a senha atual. */
  senha: string;
  grupo: GrupoAcesso;
  ativo: boolean;
}

export const GRUPOS: { valor: GrupoAcesso; rotulo: string; descricao: string }[] = [
  { valor: 'admin', rotulo: 'Administrador', descricao: 'Acesso total, inclusive usuários' },
  { valor: 'vendedor', rotulo: 'Vendedor', descricao: 'PDV e clientes' },
  { valor: 'estoquista', rotulo: 'Estoquista', descricao: 'Estoque e nota de entrada' },
  { valor: 'fiscal', rotulo: 'Fiscal', descricao: 'Painel fiscal, cancelamento, inutilização e devolução' },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formulário de usuário (Q9): novo ou edição. `existentes` serve para barrar e-mail repetido. */
@Component({
  selector: 'app-modal-usuario',
  imports: [LucideAngularModule],
  templateUrl: './modal-usuario.html',
})
export class ModalUsuario implements OnInit {
  readonly usuario = input<UsuarioLista | null>(null);
  readonly existentes = input<UsuarioLista[]>([]);
  /** Impede tirar o admin/ativo do último administrador ativo. */
  readonly ultimoAdmin = input(false);
  readonly salvar = output<UsuarioInput>();
  readonly fechar = output<void>();

  protected readonly XIcon = X;
  protected readonly SaveIcon = Save;
  protected readonly GRUPOS = GRUPOS;

  protected readonly nome = signal('');
  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly grupo = signal<GrupoAcesso>('vendedor');
  protected readonly ativo = signal(true);
  protected readonly tentouSalvar = signal(false);

  protected readonly erros = computed(() => {
    const editando = this.usuario();
    const email = this.email().trim().toLowerCase();
    const repetido = this.existentes().some((u) => u.id !== editando?.id && u.email.toLowerCase() === email);
    const senha = this.senha();
    return {
      nome: this.nome().trim() ? '' : 'Informe o nome.',
      email: !EMAIL.test(email) ? 'Informe um e-mail válido.' : repetido ? 'Já existe um usuário com este e-mail.' : '',
      senha: (editando && !senha) || senha.length >= 8 ? '' : 'A senha deve ter ao menos 8 caracteres.',
      grupo:
        this.ultimoAdmin() && (this.grupo() !== 'admin' || !this.ativo())
          ? 'Este é o único administrador ativo: não pode perder o acesso.'
          : '',
    };
  });

  ngOnInit() {
    const u = this.usuario();
    if (!u) return;
    this.nome.set(u.nome);
    this.email.set(u.email);
    this.grupo.set(u.grupo);
    this.ativo.set(u.ativo);
  }

  protected texto(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected handleSubmit(event: Event) {
    event.preventDefault();
    this.tentouSalvar.set(true);
    const erros = this.erros();
    if (erros.nome || erros.email || erros.senha || erros.grupo) return;
    this.salvar.emit({
      nome: this.nome().trim(),
      email: this.email().trim().toLowerCase(),
      senha: this.senha(),
      grupo: this.grupo(),
      ativo: this.ativo(),
    });
  }
}
