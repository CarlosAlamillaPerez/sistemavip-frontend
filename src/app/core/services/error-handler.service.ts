import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private alertService: AlertService) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ha ocurrido un error inesperado';
    console.group('Error Handler');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Error:', error);
    console.groupEnd();

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente';
          break;
        case 403:
          errorMessage = 'No tiene permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 422:
          errorMessage = this.handleValidationError(error.error);
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || 'Ha ocurrido un error'}`;
      }
    }

    this.alertService.error(errorMessage);
  }

  private handleValidationError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.errors) {
      const messages = Object.values(error.errors)
        .flat()
        .filter(msg => typeof msg === 'string');
      return messages.join('\n');
    }

    return 'Error de validación';
  }
}