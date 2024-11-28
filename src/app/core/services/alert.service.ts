import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#198754'
    });
  }

  error(message: string): void {
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: message,
      confirmButtonColor: '#dc3545'
    });
  }

  confirm(options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }): Promise<boolean> {
    return Swal.fire({
      icon: 'warning',
      title: options.title,
      text: options.text,
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545',
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar'
    }).then(result => result.isConfirmed);
  }
}