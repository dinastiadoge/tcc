import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  Archive,
  ChevronDown,
  ChevronRight,
  FileText,
  House,
  LogOut,
  LucideAngularModule,
  LucideIconData,
  Package,
  PackagePlus,
  RotateCcw,
  ShoppingCart,
  Users,
  X,
  XCircle,
} from 'lucide-angular';
import { AuthService } from '../core/auth.service';

interface ItemMenu {
  icon: LucideIconData;
  label: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  protected readonly XIcon = X;
  protected readonly FileTextIcon = FileText;
  protected readonly ChevronDownIcon = ChevronDown;
  protected readonly ChevronRightIcon = ChevronRight;
  protected readonly LogOutIcon = LogOut;

  protected readonly menuPrincipal: ItemMenu[] = [
    { icon: House, label: 'Início', path: '/' },
    { icon: ShoppingCart, label: 'PDV / Vendas', path: '/pdv' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Package, label: 'Estoque', path: '/estoque' },
  ];

  protected readonly menuFiscal: ItemMenu[] = [
    { icon: FileText, label: 'Painel Fiscal', path: '/fiscal' },
    { icon: XCircle, label: 'Cancelamento', path: '/cancelamento' },
    { icon: Archive, label: 'Inutilização', path: '/inutilizacao' },
    { icon: RotateCcw, label: 'Nota de Devolução', path: '/devolucao' },
    { icon: PackagePlus, label: 'Nota de Entrada', path: '/entrada' },
  ];

  private static caminho(url: string): string {
    return url.split(/[?#]/)[0];
  }

  /** Caminho atual (sem query/fragmento), atualizado a cada navegação. */
  private readonly pathname = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => Sidebar.caminho(e.urlAfterRedirects)),
    ),
    { initialValue: Sidebar.caminho(this.router.url) },
  );

  protected readonly fiscalAberto = signal(
    ['/fiscal', '/cancelamento', '/inutilizacao', '/devolucao', '/entrada'].some((p) =>
      this.pathname().startsWith(p),
    ),
  );

  protected readonly isFiscalActive = computed(() =>
    this.menuFiscal.some((i) => this.pathname() === i.path),
  );

  protected readonly iniciais = computed(() => this.auth.user()?.nome?.slice(0, 2).toUpperCase() ?? 'AD');

  protected isActive(path: string): boolean {
    return this.pathname() === path;
  }

  protected handleLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.closed.emit();
  }
}
