// detalle-presentador.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { 
  Presentador, 
  EstadoPresentador,
  CambioEstadoPresentadorRequest,
  ResumenPresentadorDto 
} from '@core/interfaces/presentador.interface';

@Component({
  selector: 'app-detalle-presentador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-presentador.component.html',
  styleUrls: ['./detalle-presentador.component.scss']
})
export class DetallePresentadorComponent implements OnInit {
  presentador?: Presentador;
  resumen?: ResumenPresentadorDto;
  loading = false;
  isSuperAdmin = false;
  estadosPresentador = EstadoPresentador;

  constructor(
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkRole();
    this.loadPresentador();
  }

  private checkRole(): void {
    this.authService.isSuperAdmin().subscribe(
      isSuperAdmin => this.isSuperAdmin = isSuperAdmin
    );
  }

  private loadPresentador(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.alertService.error('Error', 'ID de presentador no válido');
      this.router.navigate(['/admin/personal/presentadores']);
      return;
    }

    this.loading = true;

    // Cargar presentador y su resumen en paralelo
    Promise.all([
      this.presentadorService.getById(id).toPromise(),
      this.presentadorService.getResumen(id).toPromise()
    ]).then(([presentador, resumen]) => {
      this.presentador = presentador;
      this.resumen = resumen;
      this.loading = false;
    }).catch(error => {
      console.error('Error al cargar presentador:', error);
      this.alertService.error(
        'Error', 
        'No se pudo cargar la información del presentador',
        () => this.router.navigate(['/admin/personal/presentadores'])
      );
      this.loading = false;
    });
  }

  onBack(): void {
    this.router.navigate(['/admin/personal/presentadores']);
  }

  onEditar(): void {
    if (this.presentador) {
      this.router.navigate([`/admin/personal/presentadores/editar/${this.presentador.id}`]);
    }
  }

  verTerapeutas(): void {
    if (this.presentador) {
      this.router.navigate([`/admin/personal/presentadores/${this.presentador.id}/terapeutas`]);
    }
  }

  verComisiones(): void {
    if (this.presentador) {
      this.router.navigate(['/admin/comisiones'], { 
        queryParams: { presentadorId: this.presentador.id } 
      });
    }
  }

  onCambiarEstado(nuevoEstado: EstadoPresentador): void {
    if (!this.presentador) return;

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

        this.presentadorService.cambiarEstado(this.presentador!.id, cambioEstado).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', currentMessage.success);
            this.loadPresentador();
          },
          error: (error) => {
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