import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAsignacionComponent } from './form-asignacion.component';

describe('FormAsignacionComponent', () => {
  let component: FormAsignacionComponent;
  let fixture: ComponentFixture<FormAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAsignacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
