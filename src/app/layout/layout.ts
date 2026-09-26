import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { MobileHeader } from './mobile-header';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, MobileHeader],
  template: `
    @if (!auth.carregando() && auth.isAuthenticated()) {
      <div class="flex h-screen bg-gray-50">
        <app-sidebar [isOpen]="sidebarOpen()" (closed)="sidebarOpen.set(false)" />
        <div class="flex-1 flex flex-col min-w-0">
          <app-mobile-header (menuClick)="sidebarOpen.set(true)" />
          <main class="flex-1 overflow-y-auto pt-16 md:pt-0">
            <router-outlet />
          </main>
        </div>
      </div>
    }
  `,
})
export class Layout {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(false);

  constructor() {
    // Menu mobile aberto trava a rolagem do corpo; restaura ao fechar ou sair da tela.
    effect((onCleanup) => {
      document.body.style.overflow = this.sidebarOpen() ? 'hidden' : 'unset';
      onCleanup(() => {
        document.body.style.overflow = 'unset';
      });
    });

    // Sessão perdida com o layout aberto (ex.: 401): volta para o login.
    effect(() => {
      if (!this.auth.carregando() && !this.auth.isAuthenticated()) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }
}
