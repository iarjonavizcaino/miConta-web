import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesDespachoComponent } from './notificaciones-despacho.component';

describe('NotificacionesDespachoComponent', () => {
  let component: NotificacionesDespachoComponent;
  let fixture: ComponentFixture<NotificacionesDespachoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesDespachoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
