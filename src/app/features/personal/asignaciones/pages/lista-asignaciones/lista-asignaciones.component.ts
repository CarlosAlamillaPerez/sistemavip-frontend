import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TerapeutaPresentadorService } from '@core/services/terapeuta-presentador.service';
import { TerapeutaPresentador } from '@core/interfaces/terapeuta-presentador.interface';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';

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

  onUpdateEstado(terapeutaId: number, presentadorId: number, nuevoEstado: string): void {
    this.alertService.confirm(
      '¿Está seguro?',
      `¿Desea cambiar el estado de la asignación a ${nuevoEstado}?`,
      () => {
        this.terapeutaPresentadorService
          .updateEstado(terapeutaId, presentadorId, nuevoEstado)
          .subscribe({
            next: () => {
              this.alertService.success('¡Éxito!', 'Estado actualizado correctamente', () =>
                this.loadAsignaciones()
              );
            },
            error: (error) => {
              console.error('Error al actualizar estado:', error);
              this.alertService.error('Error', 'No se pudo actualizar el estado de la asignación');
            }
          });
      }
    );
  }
}