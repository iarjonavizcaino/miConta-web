import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesSuperadminComponent } from './notificaciones-superadmin.component';

describe('NotificacionesSuperadminComponent', () => {
  let component: NotificacionesSuperadminComponent;
  let fixture: ComponentFixture<NotificacionesSuperadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionesSuperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
