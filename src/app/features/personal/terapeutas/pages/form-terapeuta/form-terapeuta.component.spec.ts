import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTerapeutaComponent } from './form-terapeuta.component';

describe('FormTerapeutaComponent', () => {
  let component: FormTerapeutaComponent;
  let fixture: ComponentFixture<FormTerapeutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTerapeutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTerapeutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
