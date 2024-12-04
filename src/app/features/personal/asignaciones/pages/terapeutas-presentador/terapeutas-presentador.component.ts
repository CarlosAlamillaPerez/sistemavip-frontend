import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutaPresentadorService } from '@core/services/terapeuta-presentador.service';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { TerapeutaPorPresentador } from '@core/interfaces/terapeuta-presentador.interface';
import { Presentador } from '@core/interfaces/presentador.interface';

@Component({
  selector: 'app-terapeutas-presentador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terapeutas-presentador.component.html',
  styleUrls: ['./terapeutas-presentador.component.scss']
})
export class TerapeutasPresentadorComponent implements OnInit {
  terapeutas: TerapeutaPorPresentador[] = [];
  presentador?: Presentador;
  loading = false;
  presentadorId: number;

  constructor(
    private terapeutaPresentadorService: TerapeutaPresentadorService,
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.presentadorId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.presentadorId) {
      this.loadPresentador();
      this.loadTerapeutas();
    } else {
      this.router.navigate(['/admin/personal/asignaciones']);
    }
  }

  private loadPresentador(): void {
    this.presentadorService.getById(this.presentadorId).subscribe({
      next: (data) => {
        this.presentador = data;
      },
      error: (error) => {
        console.error('Error al cargar presentador:', error);
        this.alertService.error(
          'Error',
          'No se pudo cargar la información del presentador',
          () => this.router.navigate(['/admin/personal/asignaciones'])
        );
      }
    });
  }

  private loadTerapeutas(): void {
    this.loading = true;
    this.terapeutaPresentadorService.getTerapeutasByPresentador(this.presentadorId).subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeutas:', error);
        this.alertService.error('Error', 'No se pudieron cargar los terapeutas asignados');
        this.loading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/admin/personal/asignaciones']);
  }
}