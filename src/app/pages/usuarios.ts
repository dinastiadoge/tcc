import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Edit, LucideAngularModule, Plus, Search, ShieldCheck, Trash2, UserCheck, UserCog, UserX } from 'lucide-angular';
import type { GrupoAcesso } from '../types';
import { ModalConfirmar } from './modal-confirmar';
import { GRUPOS, ModalUsuario, UsuarioInput, UsuarioLista } from './modal-usuario';

// Mock até a tela ser ligada ao back. Q9: assume cadastro de usuários e grupos no próprio sistema.
const usuariosIniciais: UsuarioLista[] = [
  { id: 1, nome: 'Administrador', email: 'admin@autopecas.com', grupo: 'admin', ativo: true, ultimoAcesso: '26/09/2026' },
  { id: 2, nome: 'Carla Mendes', email: 'carla.mendes@autopecas.com', grupo: 'vendedor', ativo: true, ultimoAcesso: '26/09/2026' },
  { id: 3, nome: 'Rafael Souza', email: 'rafael.souza@autopecas.com', grupo: 'estoquista', ativo: true, ultimoAcesso: '25/09/2026' },
  { id: 4, nome: 'Helena Prado', email: 'helena.prado@autopecas.com', grupo: 'fiscal', ativo: true, ultimoAcesso: '24/09/2026' },
  { id: 5, nome: 'Marcos Lima', email: 'marcos.lima@autopecas.com', grupo: 'vendedor', ativo: false, ultimoAcesso: '02/08/2026' },
];

const corGrupo: Record<GrupoAcesso, string> = {
  admin: 'bg-red-100 text-red-700',
  vendedor: 'bg-blue-100 text-blue-700',
  estoquista: 'bg-orange-100 text-orange-700',
  fiscal: 'bg-purple-100 text-purple-700',
};

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, LucideAngularModule, ModalUsuario, ModalConfirmar],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  protected readonly EditIcon = Edit;
  protected readonly PlusIcon = Plus;
  protected readonly SearchIcon = Search;
  protected readonly ShieldIcon = ShieldCheck;
  protected readonly Trash2Icon = Trash2;
  protected readonly UserCheckIcon = UserCheck;
  protected readonly UserCogIcon = UserCog;
  protected readonly UserXIcon = UserX;

  protected readonly GRUPOS = GRUPOS;

  protected readonly usuarios = signal<UsuarioLista[]>(usuariosIniciais);
  protected readonly busca = signal('');
  protected readonly filtroGrupo = signal<'todos' | GrupoAcesso>('todos');
  /** `null` = modal fechado; `'novo'` = cadastro; `UsuarioLista` = edição. */
  protected readonly formulario = signal<'novo' | UsuarioLista | null>(null);
  protected readonly excluindo = signal<UsuarioLista | null>(null);
  protected readonly aviso = signal('');

  protected readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    return this.usuarios().filter(
      (u) =>
        (this.filtroGrupo() === 'todos' || u.grupo === this.filtroGrupo()) &&
        (!termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo)),
    );
  });

  protected readonly estatisticas = computed(() => {
    const lista = this.usuarios();
    return [
      { label: 'Total de Usuários', valor: lista.length, icone: UserCog, cor: 'bg-blue-100 text-blue-600' },
      { label: 'Ativos', valor: lista.filter((u) => u.ativo).length, icone: UserCheck, cor: 'bg-green-100 text-green-600' },
      { label: 'Inativos', valor: lista.filter((u) => !u.ativo).length, icone: UserX, cor: 'bg-gray-100 text-gray-600' },
      { label: 'Administradores', valor: lista.filter((u) => u.grupo === 'admin').length, icone: ShieldCheck, cor: 'bg-red-100 text-red-600' },
    ];
  });

  protected rotuloGrupo(grupo: GrupoAcesso): string {
    return GRUPOS.find((g) => g.valor === grupo)?.rotulo ?? grupo;
  }

  protected classeGrupo(grupo: GrupoAcesso): string {
    return corGrupo[grupo];
  }

  /** Só o usuário em edição (nunca a string `'novo'`), para passar ao modal. */
  protected editando(): UsuarioLista | null {
    const u = this.formulario();
    return u && u !== 'novo' ? u : null;
  }

  /** O sistema não pode ficar sem nenhum administrador ativo. */
  protected ehUltimoAdmin(usuario: UsuarioLista | null): boolean {
    if (!usuario || usuario.grupo !== 'admin' || !usuario.ativo) return false;
    return this.usuarios().filter((u) => u.grupo === 'admin' && u.ativo).length === 1;
  }

  protected salvar(dados: UsuarioInput) {
    // A senha só sai do front no envio ao back (H13/H14); aqui o mock não a guarda.
    const { senha: _senha, ...campos } = dados;
    this.aviso.set('');
    const atual = this.editando();
    if (atual) {
      this.usuarios.update((lista) => lista.map((u) => (u.id === atual.id ? { ...u, ...campos } : u)));
    } else {
      const id = Math.max(0, ...this.usuarios().map((u) => u.id)) + 1;
      this.usuarios.update((lista) => [...lista, { id, ...campos, ultimoAcesso: 'Nunca' }]);
    }
    this.formulario.set(null);
  }

  protected alternarAtivo(usuario: UsuarioLista) {
    if (usuario.ativo && this.ehUltimoAdmin(usuario)) {
      this.aviso.set('Este é o único administrador ativo: não pode ser desativado.');
      return;
    }
    this.aviso.set('');
    this.usuarios.update((lista) => lista.map((u) => (u.id === usuario.id ? { ...u, ativo: !u.ativo } : u)));
  }

  protected pedirExclusao(usuario: UsuarioLista) {
    if (this.ehUltimoAdmin(usuario)) {
      this.aviso.set('Este é o único administrador ativo: não pode ser excluído.');
      return;
    }
    this.aviso.set('');
    this.excluindo.set(usuario);
  }

  protected confirmarExclusao() {
    const alvo = this.excluindo();
    if (alvo) this.usuarios.update((lista) => lista.filter((u) => u.id !== alvo.id));
    this.excluindo.set(null);
  }
}
