import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerapeutasPresentadorComponent } from './terapeutas-presentador.component';

describe('TerapeutasPresentadorComponent', () => {
  let component: TerapeutasPresentadorComponent;
  let fixture: ComponentFixture<TerapeutasPresentadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerapeutasPresentadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerapeutasPresentadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
