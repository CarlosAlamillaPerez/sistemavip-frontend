import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionServicioComponent } from './confirmacion-servicio.component';

describe('ConfirmacionServicioComponent', () => {
  let component: ConfirmacionServicioComponent;
  let fixture: ComponentFixture<ConfirmacionServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
