import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TerapeutaService } from '@core/services/terapeuta.service';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';
import { 
  Terapeuta, 
  EstadoTerapeuta, 
  CambioEstadoTerapeutaRequest 
} from '@core/interfaces/terapeuta.interface';

@Component({
  selector: 'app-lista-terapeutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-terapeutas.component.html',
  styleUrls: ['./lista-terapeutas.component.scss']
})
export class ListaTerapeutasComponent implements OnInit {
  terapeutas: Terapeuta[] = [];
  loading = false;
  isSuperAdmin = false;
  estadosTerapeuta = EstadoTerapeuta;

  constructor(
    private terapeutaService: TerapeutaService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTerapeutas();
    this.checkRole();
  }

  private checkRole(): void {
    this.authService
      .hasRole(UserRole.SUPER_ADMIN)
      .subscribe((isSuperAdmin) => (this.isSuperAdmin = isSuperAdmin));
  }

  private loadTerapeutas(): void {
    this.loading = true;
    this.terapeutaService.getAll().subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeutas:', error);
        this.alertService.error('Error', 'Error al cargar la lista de terapeutas');
        this.loading = false;
      },
    });
  }

  onNuevo(): void {
    this.router.navigate(['/admin/personal/terapeutas/nuevo']);
  }

  onEditar(id: number): void {
    this.router.navigate([`/admin/personal/terapeutas/editar/${id}`]);
  }

  onCambiarEstado(id: number, nuevoEstado: EstadoTerapeuta): void {
    const isInactivacion = nuevoEstado === EstadoTerapeuta.INACTIVO;
    
    this.alertService.confirmCambioEstado(
      'Cambio de Estado',
      `¿Está seguro que desea ${isInactivacion ? 'dar de baja' : 'cambiar el estado de'} esta terapeuta?`,
      (motivo: string) => {
        const cambioEstado: CambioEstadoTerapeutaRequest = {
          estado: nuevoEstado,
          motivoEstado: motivo
        };

        this.terapeutaService.cambiarEstado(id, cambioEstado).subscribe({
          next: () => {
            this.alertService.success(
              '¡Éxito!', 
              `Terapeuta ${isInactivacion ? 'dada de baja' : 'actualizada'} correctamente`,
              () => this.loadTerapeutas()
            );
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            this.alertService.error(
              'Error', 
              `No se pudo ${isInactivacion ? 'dar de baja' : 'actualizar el estado de'} la terapeuta`
            );
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
      case EstadoTerapeuta.ACTIVO:
        return 'bg-success';
      case EstadoTerapeuta.INACTIVO:
        return 'bg-danger';
      case EstadoTerapeuta.SUSPENDIDO:
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}