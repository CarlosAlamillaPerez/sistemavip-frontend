import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutaPresentadorService } from '@core/services/terapeuta-presentador.service';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { 
  TerapeutaPorPresentador,
  EstadoAsignacion,
  CambioEstadoAsignacionRequest 
} from '@core/interfaces/terapeuta-presentador.interface';
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
  estadosAsignacion = EstadoAsignacion;

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
        this.alertService.error('Error', 'No se pudieron cargar las terapeutas asignadas');
        this.loading = false;
      }
    });
  }

  onCambiarEstado(terapeutaId: number, nuevoEstado: EstadoAsignacion): void {
    const isInactivacion = nuevoEstado === EstadoAsignacion.INACTIVO;
    
    this.alertService.confirmCambioEstado(
      'Cambio de Estado',
      `¿Está seguro que desea ${isInactivacion ? 'finalizar' : 'cambiar el estado de'} esta asignación?`,
      (motivo: string) => {
        const cambioEstado: CambioEstadoAsignacionRequest = {
          estado: nuevoEstado,
          motivoEstado: motivo
        };

        this.terapeutaPresentadorService
          .cambiarEstado(terapeutaId, this.presentadorId, cambioEstado)
          .subscribe({
            next: () => {
              this.alertService.success(
                '¡Éxito!',
                `Asignación ${isInactivacion ? 'finalizada' : 'actualizada'} correctamente`,
                () => this.loadTerapeutas()
              );
            },
            error: (error) => {
              console.error('Error al actualizar estado:', error);
              this.alertService.error(
                'Error',
                'No se pudo actualizar el estado de la asignación'
              );
            }
          });
      },
      {
        inputLabel: isInactivacion ? 'Motivo de finalización' : 'Motivo del cambio',
        inputPlaceholder: isInactivacion ? 'Ingrese el motivo de la finalización' : 'Ingrese el motivo del cambio de estado',
        confirmButtonText: isInactivacion ? 'Finalizar asignación' : 'Cambiar estado',
      }
    );
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case EstadoAsignacion.ACTIVO:
        return 'bg-success';
      case EstadoAsignacion.INACTIVO:
        return 'bg-danger';
      case EstadoAsignacion.SUSPENDIDO:
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  onBack(): void {
    this.router.navigate(['/admin/personal/asignaciones']);
  }
}