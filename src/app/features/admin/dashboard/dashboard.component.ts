import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  today: Date = new Date(); // Agregamos esta línea

  // Estos serán reemplazados con datos reales más adelante
  kpis = {
    serviciosActivos: 0,
    serviciosHoy: 0,
    terapeutasActivos: 0,
    presentadoresActivos: 0,
    ingresosHoy: 0,
    comisionesPendientes: 0
  };
}