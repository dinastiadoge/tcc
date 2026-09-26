import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';

/** Espera a validação da sessão em /auth/me e manda para /login quando não há usuário. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.carregando).pipe(
    filter((carregando) => !carregando),
    take(1),
    map(() => (auth.isAuthenticated() ? true : router.createUrlTree(['/login']))),
  );
};
