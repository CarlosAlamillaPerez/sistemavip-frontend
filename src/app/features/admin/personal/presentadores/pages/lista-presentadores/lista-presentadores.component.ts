// lista-presentadores.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { 
  Presentador, 
  EstadoPresentador, 
  CambioEstadoPresentadorRequest 
} from '@core/interfaces/presentador.interface';
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
    this.checkRole();
    this.loadPresentadores();
  }

  private checkRole(): void {
    this.authService.isSuperAdmin().subscribe(
      isSuperAdmin => this.isSuperAdmin = isSuperAdmin
    );
  }

  private loadPresentadores(): void {
    this.loading = true;
    this.presentadorService.getAll().subscribe({
      next: (presentadores) => {
        this.presentadores = presentadores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar presentadores:', error);
        this.alertService.error(
          'Error', 
          'No se pudieron cargar los presentadores. Por favor, intente nuevamente.'
        );
        this.loading = false;
      }
    });
  }

  onNuevo(): void {
    this.router.navigate(['/admin/personal/presentadores/nuevo']);
  }

  onEditar(id: number): void {
    this.router.navigate([`/admin/personal/presentadores/editar/${id}`]);
  }

  onVerDetalle(id: number): void {
    this.router.navigate([`/admin/personal/presentadores/${id}`]);
  }

  verTerapeutas(presentadorId: number): void {
    this.router.navigate([`/admin/personal/presentadores/${presentadorId}/terapeutas`]);
  }

  onCambiarEstado(id: number, nuevoEstado: EstadoPresentador): void {
    const messages = {
      [EstadoPresentador.ACTIVO]: {
        title: 'Activar Presentador',
        text: '¿Está seguro que desea activar este presentador?',
        success: 'Presentador activado correctamente',
        error: 'No se pudo activar el presentador'
      },
      [EstadoPresentador.SUSPENDIDO]: {
        title: 'Suspender Presentador',
        text: '¿Está seguro que desea suspender este presentador?',
        success: 'Presentador suspendido correctamente',
        error: 'No se pudo suspender el presentador'
      },
      [EstadoPresentador.INACTIVO]: {
        title: 'Dar de Baja Presentador',
        text: '¿Está seguro que desea dar de baja este presentador?',
        success: 'Presentador dado de baja correctamente',
        error: 'No se pudo dar de baja el presentador'
      }
    };

    const currentMessage = messages[nuevoEstado];
    
    this.alertService.confirmCambioEstado(
      currentMessage.title,
      currentMessage.text,
      (motivo: string) => {
        const cambioEstado: CambioEstadoPresentadorRequest = {
          estado: nuevoEstado,
          motivoEstado: motivo
        };

        this.presentadorService.cambiarEstado(id, cambioEstado).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', currentMessage.success);
            this.loadPresentadores();
          },
          error: (error) => {
            // Si es un error de validación específico
            if (error.error?.code === 'VALIDACION_ESTADO') {
              this.alertService.warning(
                'No se puede cambiar el estado', 
                error.error.message
              );
            } else {
              this.alertService.error('Error', currentMessage.error);
            }
          }
        });
      }
    );
  }

  getEstadoClass(estado: EstadoPresentador): string {
    const classes = {
      [EstadoPresentador.ACTIVO]: 'bg-success',
      [EstadoPresentador.INACTIVO]: 'bg-danger',
      [EstadoPresentador.SUSPENDIDO]: 'bg-warning'
    };
    return classes[estado] || 'bg-secondary';
  }
}