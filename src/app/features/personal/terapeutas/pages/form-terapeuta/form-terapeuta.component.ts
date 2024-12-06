import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TerapeutaService } from '@core/services/terapeuta.service';
import { AlertService } from '@core/services/alert.service';
import { 
  CreateTerapeutaRequest, 
  UpdateTerapeutaRequest, 
  Terapeuta,
  EstadoTerapeuta 
} from '@core/interfaces/terapeuta.interface';

@Component({
  selector: 'app-form-terapeuta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-terapeuta.component.html',
  styleUrls: ['./form-terapeuta.component.scss']
})
export class FormTerapeutaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isEditing = false;
  terapeutaId?: number;
  terapeuta?: Terapeuta;
  estadosTerapeuta = EstadoTerapeuta;

  constructor(
    private fb: FormBuilder,
    private terapeutaService: TerapeutaService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required]],
      estatura: ['', [Validators.required, Validators.maxLength(20)]],
      documentoIdentidad: ['', [Validators.required, Validators.maxLength(20)]],
      tarifaBase: [1000, [Validators.required, Validators.min(0)]],
      tarifaExtra: [1100, [Validators.required, Validators.min(0)]],
      notas: ['']
    });
  }

  ngOnInit(): void {
    this.terapeutaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.terapeutaId) {
      this.isEditing = true;
      this.loadTerapeuta();
    }
  }

  private loadTerapeuta(): void {
    if (!this.terapeutaId) return;

    this.loading = true;
    this.terapeutaService.getById(this.terapeutaId).subscribe({
      next: (terapeuta) => {
        this.terapeuta = terapeuta;
        this.form.patchValue({
          nombre: terapeuta.nombre,
          apellido: terapeuta.apellido,
          telefono: terapeuta.telefono,
          email: terapeuta.email,
          fechaNacimiento: this.formatDate(terapeuta.fechaNacimiento),
          estatura: terapeuta.estatura,
          documentoIdentidad: terapeuta.documentoIdentidad,
          tarifaBase: terapeuta.tarifaBase,
          tarifaExtra: terapeuta.tarifaExtra,
          notas: terapeuta.notas
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeuta:', error);
        this.alertService.error(
          'Error',
          'No se pudo cargar la información de la terapeuta',
          () => this.router.navigate(['/admin/personal/terapeutas'])
        );
      }
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case EstadoTerapeuta.ACTIVO:
        return 'text-success';
      case EstadoTerapeuta.INACTIVO:
        return 'text-danger';
      case EstadoTerapeuta.SUSPENDIDO:
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
        this.updateTerapeuta();
      } else {
        this.createTerapeuta();
      }
    } else {
      this.form.markAllAsTouched();
      this.alertService.warning(
        'Formulario Inválido',
        'Por favor, revise los campos marcados en rojo'
      );
    }
  }

  private createTerapeuta(): void {
    const data: CreateTerapeutaRequest = this.form.value;

    this.terapeutaService.create(data).subscribe({
      next: () => {
        this.alertService.success(
          '¡Éxito!',
          'Terapeuta creada correctamente',
          () => this.router.navigate(['/admin/personal/terapeutas'])
        );
      },
      error: (error) => {
        console.error('Error al crear terapeuta:', error);
        this.alertService.error(
          'Error',
          'No se pudo crear la terapeuta'
        );
        this.loading = false;
      }
    });
  }

  private updateTerapeuta(): void {
    if (!this.terapeutaId) return;

    const data: UpdateTerapeutaRequest = this.form.value;

    this.terapeutaService.update(this.terapeutaId, data).subscribe({
      next: () => {
        this.alertService.success(
          '¡Éxito!',
          'Terapeuta actualizada correctamente',
          () => this.router.navigate(['/admin/personal/terapeutas'])
        );
      },
      error: (error) => {
        console.error('Error al actualizar terapeuta:', error);
        this.alertService.error(
          'Error',
          'No se pudo actualizar la terapeuta'
        );
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/personal/terapeutas']);
  }
}