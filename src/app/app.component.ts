import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { TestService } from './core/services/test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistema-vip-frontend';

  constructor(private testService: TestService) {}

  testLoadingIndicator(): void {
    console.log('Component: Iniciando test');
    this.testService.testLoading().subscribe({
      next: (response: any) => {
        console.log('Component: Test completado', response);
      },
      error: (error: any) => {
        console.error('Component: Error', error);
      }
    });
  }
}