import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContadorComponent } from './modal-contador.component';

describe('ModalContadorComponent', () => {
  let component: ModalContadorComponent;
  let fixture: ComponentFixture<ModalContadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
