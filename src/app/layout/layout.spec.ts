import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../core/auth.service';
import { AuthApiService } from '../services';
import { Layout } from './layout';

@Component({ selector: 'app-login-stub', template: '' })
class LoginStub {}

describe('Layout', () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.body.style.overflow = '';
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'login', component: LoginStub }]),
        { provide: AuthApiService, useValue: {} },
      ],
    });
  });

  it('menu mobile aberto trava a rolagem do corpo e restaura ao fechar', async () => {
    TestBed.inject(AuthService).user.set({ id: 1, nome: 'Administrador', email: 'a@a.com' });
    const fixture = TestBed.createComponent(Layout);
    await fixture.whenStable();

    const menu = fixture.nativeElement.querySelector('button[aria-label="Abrir menu"]') as HTMLButtonElement;
    menu.click();
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('hidden');

    const fechar = fixture.nativeElement.querySelector('button[aria-label="Fechar menu"]') as HTMLButtonElement;
    fechar.click();
    await fixture.whenStable();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('restaura a rolagem do corpo ao sair da tela', async () => {
    TestBed.inject(AuthService).user.set({ id: 1, nome: 'Administrador', email: 'a@a.com' });
    const fixture = TestBed.createComponent(Layout);
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('button[aria-label="Abrir menu"]') as HTMLButtonElement).click();
    await fixture.whenStable();

    fixture.destroy();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('sem usuário não renderiza o shell e volta para /login', async () => {
    const fixture = TestBed.createComponent(Layout);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('aside')).toBeNull();
    await vi.waitFor(() => expect(TestBed.inject(Router).url).toBe('/login'));
  });
});
