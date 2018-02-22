import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImpuestosComponent } from './modal-impuestos.component';

describe('ModalImpuestosComponent', () => {
  let component: ModalImpuestosComponent;
  let fixture: ComponentFixture<ModalImpuestosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImpuestosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImpuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
