import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizacionServicioComponent } from './finalizacion-servicio.component';

describe('FinalizacionServicioComponent', () => {
  let component: FinalizacionServicioComponent;
  let fixture: ComponentFixture<FinalizacionServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizacionServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
