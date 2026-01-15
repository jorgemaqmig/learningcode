import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  
  const token = authService.getToken();
  
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          console.error('Authentication error - clearing auth data');
          authService.logout();
          router.navigate(['/login'], { 
            queryParams: { returnUrl: router.url }
          });
        }
        return throwError(() => error);
      })
    );
  }
  
  // Si la ruta es login o register, no necesitamos token
  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  // Para otras rutas sin token, redirigir al login
  console.warn('Protected route accessed without token - redirecting to login');
  router.navigate(['/login'], { 
    queryParams: { returnUrl: router.url }
  });
  return throwError(() => new Error('No autorizado'));
}; 