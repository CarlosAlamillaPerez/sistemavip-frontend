import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoServicioComponent } from './seguimiento-servicio.component';

describe('SeguimientoServicioComponent', () => {
  let component: SeguimientoServicioComponent;
  let fixture: ComponentFixture<SeguimientoServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
