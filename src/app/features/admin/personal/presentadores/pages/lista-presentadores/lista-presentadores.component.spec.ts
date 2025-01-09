import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPresentadoresComponent } from './lista-presentadores.component';

describe('ListaPresentadoresComponent', () => {
  let component: ListaPresentadoresComponent;
  let fixture: ComponentFixture<ListaPresentadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPresentadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPresentadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
