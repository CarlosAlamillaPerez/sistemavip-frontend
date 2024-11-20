import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = signal<boolean>(false);
  isLoading$ = this.isLoading.asReadonly();

  constructor() {
    console.log('LoadingService inicializado');
  }

  setLoading(loading: boolean): void {
    console.log('setLoading:', loading); // Para debug
    this.isLoading.set(loading);
  }
}