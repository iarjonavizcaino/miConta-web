import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeStatusComponent } from './modal-change-status.component';

describe('ModalChangeStatusComponent', () => {
  let component: ModalChangeStatusComponent;
  let fixture: ComponentFixture<ModalChangeStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangeStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
