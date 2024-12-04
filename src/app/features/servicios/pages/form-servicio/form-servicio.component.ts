import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '@core/services/servicio.service';
import { TerapeutaService } from '@core/services/terapeuta.service';
import { AlertService } from '@core/services/alert.service';
import { Servicio, CreateServicioRequest } from '@core/interfaces/servicio.interface';
import { Terapeuta } from '@core/interfaces/terapeuta.interface';

@Component({
  selector: 'app-form-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-servicio.component.html'
})
export class FormServicioComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditing = false;
  servicioId?: number;
  terapeutas: Terapeuta[] = [];

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private terapeutaService: TerapeutaService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditing = !!this.servicioId;
  }

  ngOnInit(): void {
    this.loadTerapeutas();
    if (this.isEditing && this.servicioId) {
      this.loadServicio(this.servicioId);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      fechaServicio: ['', [Validators.required]],
      tipoServicio: ['', [Validators.required]],
      direccion: [''],
      montoTotal: [0, [Validators.required, Validators.min(0)]],
      notas: [''],
      terapeutas: this.fb.array([])
    });
  }

  private loadTerapeutas(): void {
    this.loading = true;
    this.terapeutaService.getActivos().subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeutas:', error);
        this.alertService.error('Error', 'No se pudieron cargar los terapeutas');
        this.loading = false;
      }
    });
  }

  private loadServicio(id: number): void {
    this.loading = true;
    this.servicioService.getById(id).subscribe({
      next: (servicio) => {
        this.updateForm(servicio);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicio:', error);
        this.alertService.error('Error', 'No se pudo cargar el servicio');
        this.loading = false;
        this.router.navigate(['/servicios']);
      }
    });
  }

  private updateForm(servicio: Servicio): void {
    this.form.patchValue({
      fechaServicio: servicio.fechaServicio,
      tipoServicio: servicio.tipoServicio,
      direccion: servicio.direccion,
      montoTotal: servicio.montoTotal,
      notas: servicio.notas
    });

    // Limpiar y recrear el FormArray de terapeutas
    const terapeutasArray = this.form.get('terapeutas') as FormArray;
    terapeutasArray.clear();

    servicio.terapeutas.forEach(terapeuta => {
      terapeutasArray.push(this.fb.group({
        terapeutaId: [terapeuta.terapeutaId, Validators.required],
        montoTerapeuta: [terapeuta.montoTerapeuta, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  get terapeutasArray(): FormArray {
    return this.form.get('terapeutas') as FormArray;
  }

  addTerapeuta(): void {
    const terapeutasArray = this.form.get('terapeutas') as FormArray;
    terapeutasArray.push(this.fb.group({
      terapeutaId: ['', Validators.required],
      montoTerapeuta: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeTerapeuta(index: number): void {
    const terapeutasArray = this.form.get('terapeutas') as FormArray;
    terapeutasArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading) {
      this.loading = true;
      const formData: CreateServicioRequest = {
        ...this.form.value,
        fechaServicio: new Date(this.form.value.fechaServicio)
      };

      if (this.isEditing && this.servicioId) {
        this.servicioService.update(this.servicioId, formData).subscribe({
          next: () => {
            this.alertService.success('Éxito', 'Servicio actualizado correctamente', 
              () => this.router.navigate(['/servicios']));
          },
          error: this.handleError.bind(this)
        });
      } else {
        this.servicioService.create(formData).subscribe({
          next: () => {
            this.alertService.success('Éxito', 'Servicio creado correctamente', 
              () => this.router.navigate(['/servicios']));
          },
          error: this.handleError.bind(this)
        });
      }
    } else {
      this.form.markAllAsTouched();
      this.alertService.warning('Formulario Inválido', 'Por favor, complete todos los campos requeridos');
    }
  }

  private handleError(error: any): void {
    console.error('Error en operación de servicio:', error);
    this.alertService.error('Error', error.error?.message || 'No se pudo procesar la operación');
    this.loading = false;
  }

  onCancel(): void {
    this.router.navigate(['/servicios']);
  }
}