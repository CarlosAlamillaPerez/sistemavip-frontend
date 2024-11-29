import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  reportesDisponibles = [
    { id: 1, nombre: 'Servicios por Período', descripcion: 'Resumen de servicios realizados en un período específico' },
    { id: 2, nombre: 'Rendimiento de Personal', descripcion: 'Análisis de rendimiento de terapeutas y presentadores' },
    { id: 3, nombre: 'Estado de Comisiones', descripcion: 'Detalle de comisiones pagadas y pendientes' },
    { id: 4, nombre: 'Análisis de Ingresos', descripcion: 'Resumen de ingresos y tendencias' }
  ];
}