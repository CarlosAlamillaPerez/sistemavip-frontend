import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorHandler.handleError(error);
      
      // Manejo especial para errores de autenticación
      if (error.status === 401) {
        // Limpiar token y redirigir a login
        localStorage.removeItem('token');
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};