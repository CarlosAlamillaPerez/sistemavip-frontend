import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success(title: string, text: string, callback?: () => void): void {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#198754'
    }).then(() => {
      if (callback) callback();
    });
  }

  error(title: string, text: string, callback?: () => void): void {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#dc3545'
    }).then(() => {
      if (callback) callback();
    });
  }

  warning(title: string, text: string, callback?: () => void): void {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#ffc107'
    }).then(() => {
      if (callback) callback();
    });
  }

  info(title: string, text: string, callback?: () => void): void {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#0dcaf0'
    }).then(() => {
      if (callback) callback();
    });
  }

  confirm(
    title: string, 
    text: string, 
    callback: () => void,
    options: {
      confirmButtonText?: string;
      cancelButtonText?: string;
    } = {}
  ): void {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545',
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar'
    }).then(result => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }
}