import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBitacoraComponent } from './modal-bitacora.component';

describe('ModalBitacoraComponent', () => {
  let component: ModalBitacoraComponent;
  let fixture: ComponentFixture<ModalBitacoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBitacoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
