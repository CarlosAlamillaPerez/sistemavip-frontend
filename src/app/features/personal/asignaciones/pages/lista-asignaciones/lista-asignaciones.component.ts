import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TerapeutaPresentadorService } from '@core/services/terapeuta-presentador.service';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';
import { 
  TerapeutaPresentador, 
  EstadoAsignacion,
  CambioEstadoAsignacionRequest 
} from '@core/interfaces/terapeuta-presentador.interface';

@Component({
  selector: 'app-lista-asignaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-asignaciones.component.html',
  styleUrls: ['./lista-asignaciones.component.scss']
})
export class ListaAsignacionesComponent implements OnInit {
  asignaciones: TerapeutaPresentador[] = [];
  loading = false;
  isSuperAdmin = false;
  estadosAsignacion = EstadoAsignacion;

  constructor(
    private terapeutaPresentadorService: TerapeutaPresentadorService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAsignaciones();
    this.checkRole();
  }

  private checkRole(): void {
    this.authService
      .hasRole(UserRole.SUPER_ADMIN)
      .subscribe((isSuperAdmin) => (this.isSuperAdmin = isSuperAdmin));
  }

  private loadAsignaciones(): void {
    this.loading = true;
    this.terapeutaPresentadorService.getAll().subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar asignaciones:', error);
        this.alertService.error('Error', 'Error al cargar la lista de asignaciones');
        this.loading = false;
      }
    });
  }

  onNueva(): void {
    this.router.navigate(['/admin/personal/asignaciones/nueva']);
  }

  onVerTerapeutas(presentadorId: number): void {
    this.router.navigate([`/admin/personal/asignaciones/presentador/${presentadorId}`]);
  }

  onCambiarEstado(terapeutaId: number, presentadorId: number, nuevoEstado: EstadoAsignacion): void {
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
          .cambiarEstado(terapeutaId, presentadorId, cambioEstado)
          .subscribe({
            next: () => {
              this.alertService.success(
                '¡Éxito!',
                `Asignación ${isInactivacion ? 'finalizada' : 'actualizada'} correctamente`,
                () => this.loadAsignaciones()
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
}