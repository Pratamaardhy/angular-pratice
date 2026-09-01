import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../store/auth.store';
import { IS_PUBLIC_API } from '../tokens/http-context.token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Periksa apakah request ditandai sebagai Public API
  const isPublic = req.context.get(IS_PUBLIC_API);

  let authReq = req;

  // Jika BUKAN Public API (Protected), tambahkan Authorization Header
if (!isPublic) {
  const token = authStore.accessToken();

  // Pastikan token ada dan tidak kosong
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublic) {
        authStore.clearSession();
        void router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
      }
      return throwError(() => error);
    }),
  );
};
