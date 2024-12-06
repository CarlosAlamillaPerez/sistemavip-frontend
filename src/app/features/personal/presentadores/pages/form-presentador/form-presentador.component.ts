import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { 
  CreatePresentadorRequest, 
  UpdatePresentadorRequest, 
  Presentador,
  EstadoPresentador 
} from '@core/interfaces/presentador.interface';

@Component({
  selector: 'app-form-presentador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-presentador.component.html',
  styleUrls: ['./form-presentador.component.scss']
})
export class FormPresentadorComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEditing = false;
  presentadorId?: number;
  presentador?: Presentador;
  estadosPresentador = EstadoPresentador;

  constructor(
    private fb: FormBuilder,
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      documentoIdentidad: ['', [Validators.required, Validators.maxLength(20)]],
      porcentajeComision: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
      notas: ['']
    });
  }

  ngOnInit(): void {
    this.presentadorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.presentadorId) {
      this.isEditing = true;
      this.loadPresentador();
    }
  }

  private loadPresentador(): void {
    if (!this.presentadorId) return;

    this.loading = true;
    this.presentadorService.getById(this.presentadorId).subscribe({
      next: (presentador) => {
        this.presentador = presentador;
        this.form.patchValue({
          nombre: presentador.nombre,
          apellido: presentador.apellido,
          telefono: presentador.telefono,
          email: presentador.email,
          documentoIdentidad: presentador.documentoIdentidad,
          porcentajeComision: presentador.porcentajeComision,
          notas: presentador.notas
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar presentador:', error);
        this.alertService.error(
          'Error',
          'No se pudo cargar la información del presentador',
          () => this.router.navigate(['/admin/personal/presentadores'])
        );
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case EstadoPresentador.ACTIVO:
        return 'text-success';
      case EstadoPresentador.INACTIVO:
        return 'text-danger';
      case EstadoPresentador.SUSPENDIDO:
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  }

  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleString();
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading) {
      this.loading = true;

      if (this.isEditing) {
        this.updatePresentador();
      } else {
        this.createPresentador();
      }
    } else {
      this.form.markAllAsTouched();
      this.alertService.warning(
        'Formulario Inválido',
        'Por favor, revise los campos marcados en rojo'
      );
    }
  }

  private createPresentador(): void {
    const data: CreatePresentadorRequest = this.form.value;

    this.presentadorService.create(data).subscribe({
      next: () => {
        this.alertService.success(
          '¡Éxito!',
          'Presentador creado correctamente',
          () => this.router.navigate(['/admin/personal/presentadores'])
        );
      },
      error: (error) => {
        console.error('Error al crear presentador:', error);
        this.alertService.error(
          'Error',
          'No se pudo crear el presentador'
        );
        this.loading = false;
      }
    });
  }

  private updatePresentador(): void {
    if (!this.presentadorId) return;

    const data: UpdatePresentadorRequest = this.form.value;

    this.presentadorService.update(this.presentadorId, data).subscribe({
      next: () => {
        this.alertService.success(
          '¡Éxito!',
          'Presentador actualizado correctamente',
          () => this.router.navigate(['/admin/personal/presentadores'])
        );
      },
      error: (error) => {
        console.error('Error al actualizar presentador:', error);
        this.alertService.error(
          'Error',
          'No se pudo actualizar el presentador'
        );
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/personal/presentadores']);
  }
}