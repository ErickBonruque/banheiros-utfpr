import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from './api';
import { AuthService } from './auth.service';

/**
 * Anexa o token JWT (Authorization: Bearer ...) em toda requisicao para a API
 * e, se a API responder 401 (token invalido/expirado), limpa a sessao e
 * redireciona para o login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.token;
  if (token && req.url.startsWith(API_URL) && !req.url.includes('/oauth/token')) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        auth.limparSessao();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
