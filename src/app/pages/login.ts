import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertCircle, Eye, EyeOff, LogIn, LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly mostrarSenha = signal(false);
  protected readonly erro = signal('');
  protected readonly carregando = signal(false);

  protected readonly AlertCircleIcon = AlertCircle;
  protected readonly EyeIcon = Eye;
  protected readonly EyeOffIcon = EyeOff;
  protected readonly LogInIcon = LogIn;

  protected async handleSubmit() {
    this.erro.set('');
    this.carregando.set(true);

    const ok = await this.auth.login(this.email(), this.senha());
    this.carregando.set(false);

    if (ok) {
      this.router.navigateByUrl('/', { replaceUrl: true });
    } else {
      this.erro.set('E-mail ou senha incorretos.');
    }
  }
}
