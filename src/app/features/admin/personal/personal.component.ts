import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  // Datos de ejemplo
  resumenPersonal = {
    totalTerapeutas: 0,
    terapeutasActivos: 0,
    totalPresentadores: 0,
    presentadoresActivos: 0
  };
}