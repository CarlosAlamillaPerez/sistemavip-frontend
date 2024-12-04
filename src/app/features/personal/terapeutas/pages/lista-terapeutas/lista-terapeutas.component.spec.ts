import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTerapeutasComponent } from './lista-terapeutas.component';

describe('ListaTerapeutasComponent', () => {
  let component: ListaTerapeutasComponent;
  let fixture: ComponentFixture<ListaTerapeutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTerapeutasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTerapeutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
