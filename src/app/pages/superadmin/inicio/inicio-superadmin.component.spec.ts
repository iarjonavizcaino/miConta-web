import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSuperadminComponent } from './inicio-superadmin.component';

describe('InicioSuperadminComponent', () => {
  let component: InicioSuperadminComponent;
  let fixture: ComponentFixture<InicioSuperadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioSuperadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioSuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
