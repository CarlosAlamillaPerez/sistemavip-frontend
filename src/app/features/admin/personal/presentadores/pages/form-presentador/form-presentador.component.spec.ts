import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPresentadorComponent } from './form-presentador.component';

describe('FormPresentadorComponent', () => {
  let component: FormPresentadorComponent;
  let fixture: ComponentFixture<FormPresentadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPresentadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPresentadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
