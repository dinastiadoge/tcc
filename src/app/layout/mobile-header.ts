import { Component, output } from '@angular/core';
import { LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-mobile-header',
  imports: [LucideAngularModule],
  template: `
    <div class="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4">
      <button
        (click)="menuClick.emit()"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Abrir menu"
      >
        <lucide-icon [img]="MenuIcon" [size]="24" class="text-gray-700" />
      </button>
      <h1 class="ml-3 text-lg text-gray-900">WC Autopeças</h1>
    </div>
  `,
})
export class MobileHeader {
  readonly menuClick = output<void>();
  protected readonly MenuIcon = Menu;
}
