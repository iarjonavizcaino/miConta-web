import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCierreBimestreComponent } from './modal-cierre-bimestre.component';

describe('ModalCierreBimestreComponent', () => {
  let component: ModalCierreBimestreComponent;
  let fixture: ComponentFixture<ModalCierreBimestreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCierreBimestreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCierreBimestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
