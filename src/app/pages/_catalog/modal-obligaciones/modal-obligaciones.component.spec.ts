import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObligacionesComponent } from './modal-obligaciones.component';

describe('ModalObligacionesComponent', () => {
  let component: ModalObligacionesComponent;
  let fixture: ComponentFixture<ModalObligacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalObligacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalObligacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
