import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthApiService, clearToken, definirAoNaoAutorizado, getToken, setToken } from '../services';
import type { Usuario } from '../types';

/** Estado da sessão (substitui o AuthContext do React). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);

  readonly user = signal<Usuario | null>(null);
  // Há token salvo? Então a sessão precisa ser validada em /auth/me antes de renderizar.
  readonly carregando = signal(getToken() !== null);
  readonly isAuthenticated = computed(() => this.user() !== null);

  constructor() {
    // Versões anteriores guardavam o usuário em localStorage; remove o resíduo.
    try {
      localStorage.removeItem('wc_user');
    } catch {
      // storage indisponível
    }

    definirAoNaoAutorizado(() => this.user.set(null));

    if (getToken() === null) return;
    this.api
      .me()
      .then((u) => this.user.set(u))
      .catch(() => {
        clearToken();
        this.user.set(null);
      })
      .finally(() => this.carregando.set(false));
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const { token, usuario } = await this.api.login(email, password);
      setToken(token);
      this.user.set(usuario);
      return true;
    } catch {
      return false;
    }
  }

  logout() {
    clearToken();
    this.user.set(null);
  }
}
