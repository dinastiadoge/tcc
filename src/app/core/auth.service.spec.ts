import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthApiService } from '../services';
import type { Usuario } from '../types';
import { AuthService } from './auth.service';

const usuario: Usuario = { id: 'u-1', nome: 'Administrador', email: 'admin@autopecas.com' };

function criar(api: Partial<Record<keyof AuthApiService, unknown>>): AuthService {
  TestBed.configureTestingModule({
    providers: [{ provide: AuthApiService, useValue: api }],
  });
  return TestBed.inject(AuthService);
}

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('sessão restaurada: valida o token em /auth/me e libera o layout', async () => {
    sessionStorage.setItem('wc_token', 'token-valido');
    const me = vi.fn().mockResolvedValue(usuario);
    const auth = criar({ me });

    expect(auth.carregando()).toBe(true);
    await vi.waitFor(() => expect(auth.carregando()).toBe(false));

    expect(me).toHaveBeenCalledOnce();
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()).toEqual(usuario);
  });

  it('sessão restaurada com erro/401: limpa o token e fica deslogado', async () => {
    sessionStorage.setItem('wc_token', 'token-expirado');
    const auth = criar({ me: vi.fn().mockRejectedValue(new Error('401')) });

    await vi.waitFor(() => expect(auth.carregando()).toBe(false));

    expect(auth.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('wc_token')).toBeNull();
  });

  it('sem token: não chama a API e não fica carregando', () => {
    const me = vi.fn();
    const auth = criar({ me });

    expect(auth.carregando()).toBe(false);
    expect(auth.isAuthenticated()).toBe(false);
    expect(me).not.toHaveBeenCalled();
  });

  it('login inválido: devolve false, sem sessão nem token', async () => {
    const auth = criar({ login: vi.fn().mockRejectedValue(new Error('401')) });

    expect(await auth.login('a@a.com', 'errada')).toBe(false);
    expect(auth.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('wc_token')).toBeNull();
  });

  it('login válido: guarda o token só em sessionStorage', async () => {
    const auth = criar({ login: vi.fn().mockResolvedValue({ token: 't-1', usuario }) });

    expect(await auth.login('admin@autopecas.com', 'admin123')).toBe(true);
    expect(auth.user()).toEqual(usuario);
    expect(sessionStorage.getItem('wc_token')).toBe('t-1');
    expect(localStorage.getItem('wc_token')).toBeNull();
  });

  it('remove o resíduo wc_user do localStorage', () => {
    localStorage.setItem('wc_user', '{"nome":"antigo"}');
    criar({});

    expect(localStorage.getItem('wc_user')).toBeNull();
  });

  it('logout limpa token e usuário', async () => {
    const auth = criar({ login: vi.fn().mockResolvedValue({ token: 't-1', usuario }) });
    await auth.login('admin@autopecas.com', 'admin123');

    auth.logout();

    expect(auth.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem('wc_token')).toBeNull();
  });
});
