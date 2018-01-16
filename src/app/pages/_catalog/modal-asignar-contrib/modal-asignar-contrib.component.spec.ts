import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarContribComponent } from './modal-asignar-contrib.component';

describe('ModalAsignarContribComponent', () => {
  let component: ModalAsignarContribComponent;
  let fixture: ComponentFixture<ModalAsignarContribComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAsignarContribComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAsignarContribComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
