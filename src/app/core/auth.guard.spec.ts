import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthApiService } from '../services';
import type { Usuario } from '../types';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

const usuario: Usuario = { id: 1, nome: 'Administrador', email: 'admin@autopecas.com' };

async function executarGuard(): Promise<boolean | UrlTree> {
  const resultado = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
  if (!isObservable(resultado)) throw new Error('o guard deveria devolver um Observable');
  return firstValueFrom(resultado as Observable<boolean | UrlTree>);
}

describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('sem token: redireciona para /login', async () => {
    TestBed.configureTestingModule({ providers: [{ provide: AuthApiService, useValue: {} }] });

    const destino = await executarGuard();

    expect(destino).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(destino as UrlTree)).toBe('/login');
  });

  it('espera a validação da sessão antes de decidir', async () => {
    sessionStorage.setItem('wc_token', 'token-valido');
    let liberar!: (u: Usuario) => void;
    const me = () => new Promise<Usuario>((resolve) => (liberar = resolve));
    TestBed.configureTestingModule({ providers: [{ provide: AuthApiService, useValue: { me } }] });
    TestBed.inject(AuthService);

    const pendente = executarGuard();
    liberar(usuario);

    expect(await pendente).toBe(true);
  });

  it('token rejeitado em /auth/me: redireciona para /login', async () => {
    sessionStorage.setItem('wc_token', 'token-expirado');
    TestBed.configureTestingModule({
      providers: [{ provide: AuthApiService, useValue: { me: () => Promise.reject(new Error('401')) } }],
    });

    const destino = await executarGuard();

    expect(destino).toBeInstanceOf(UrlTree);
    expect(sessionStorage.getItem('wc_token')).toBeNull();
  });
});
