import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConceptosComponent } from './modal-conceptos.component';

describe('ModalConceptosComponent', () => {
  let component: ModalConceptosComponent;
  let fixture: ComponentFixture<ModalConceptosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConceptosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
