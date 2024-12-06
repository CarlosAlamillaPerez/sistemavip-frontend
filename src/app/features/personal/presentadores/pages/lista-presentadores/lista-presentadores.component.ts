import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { Presentador, EstadoPresentador, CambioEstadoPresentadorRequest } from '@core/interfaces/presentador.interface';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';

@Component({
  selector: 'app-lista-presentadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-presentadores.component.html',
  styleUrls: ['./lista-presentadores.component.scss']
})
export class ListaPresentadoresComponent implements OnInit {
  presentadores: Presentador[] = [];
  loading = false;
  isSuperAdmin = false;
  estadosPresentador = EstadoPresentador;

  constructor(
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPresentadores();
    this.checkRole();
  }

  private checkRole(): void {
    this.authService
      .hasRole(UserRole.SUPER_ADMIN)
      .subscribe((isSuperAdmin) => (this.isSuperAdmin = isSuperAdmin));
  }

  private loadPresentadores(): void {
    this.loading = true;
    this.presentadorService.getAll().subscribe({
      next: (data) => {
        this.presentadores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar presentadores:', error);
        this.alertService.error('Error', 'Error al cargar la lista de presentadores');
        this.loading = false;
      },
    });
  }

  onNuevo(): void {
    this.router.navigate(['/admin/personal/presentadores/nuevo']);
  }

  onEditar(id: number): void {
    this.router.navigate([`/admin/personal/presentadores/editar/${id}`]);
  }

  onCambiarEstado(id: number, nuevoEstado: EstadoPresentador): void {
    const isInactivacion = nuevoEstado === EstadoPresentador.INACTIVO;
    
    this.alertService.confirmCambioEstado(
      'Cambio de Estado',
      `¿Está seguro que desea ${isInactivacion ? 'dar de baja' : 'cambiar el estado de'} este presentador?`,
      (motivo: string) => {
        const cambioEstado: CambioEstadoPresentadorRequest = {
          estado: nuevoEstado,
          motivoEstado: motivo
        };
  
        this.presentadorService.cambiarEstado(id, cambioEstado).subscribe({
          next: () => {
            this.alertService.success(
              '¡Éxito!', 
              `Presentador ${isInactivacion ? 'dado de baja' : 'actualizado'} correctamente`,
              () => this.loadPresentadores()
            );
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            
            // Manejar errores específicos de validación
            if (error.error?.code === 'VALIDACION_ESTADO') {
              this.alertService.warning(
                'No se puede cambiar el estado', 
                error.error.message
              );
            } else {
              this.alertService.error(
                'Error', 
                `No se pudo ${isInactivacion ? 'dar de baja' : 'actualizar el estado del'} presentador`
              );
            }
          },
        });
      },
      {
        inputLabel: isInactivacion ? 'Motivo de baja' : 'Motivo del cambio',
        inputPlaceholder: isInactivacion ? 'Ingrese el motivo de la baja' : 'Ingrese el motivo del cambio de estado',
        confirmButtonText: isInactivacion ? 'Dar de baja' : 'Cambiar estado',
      }
    );
  }
  
  getEstadoClass(estado: string): string {
    switch (estado) {
      case EstadoPresentador.ACTIVO:
        return 'bg-success';
      case EstadoPresentador.INACTIVO:
        return 'bg-danger';
      case EstadoPresentador.SUSPENDIDO:
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}