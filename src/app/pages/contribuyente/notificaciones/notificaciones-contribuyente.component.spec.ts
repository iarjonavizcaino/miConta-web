import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesContribuyenteComponent } from './notificaciones-contribuyente.component';

describe('NotificacionesContribuyenteComponent', () => {
  let component: NotificacionesContribuyenteComponent;
  let fixture: ComponentFixture<NotificacionesContribuyenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesContribuyenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesContribuyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
