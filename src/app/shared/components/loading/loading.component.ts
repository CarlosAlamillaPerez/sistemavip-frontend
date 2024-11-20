import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (loadingService.isLoading$()) {
    <div class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-primary">Cargando... {{elapsedTime}}s</p>
      </div>
    </div>
    }
  `,
    styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      background-color: white;
      padding: 2rem 3rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
    elapsedTime = 0;
    private intervalId?: number;
    private previousLoadingState = false;

    constructor(public loadingService: LoadingService) { }

    ngOnInit() {
        // Iniciar un intervalo que verifique el estado del loading
        this.intervalId = window.setInterval(() => {
            const isLoading = this.loadingService.isLoading$();

            // Si el estado cambió a true
            if (isLoading && !this.previousLoadingState) {
                this.elapsedTime = 0;
                this.previousLoadingState = true;
            }

            // Si está cargando, incrementar el contador
            if (isLoading) {
                this.elapsedTime++;
            }

            // Si el estado cambió a false
            if (!isLoading && this.previousLoadingState) {
                this.elapsedTime = 0;
                this.previousLoadingState = false;
            }
        }, 1000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}