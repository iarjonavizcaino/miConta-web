import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioDespachoComponent } from './inicio-despacho.component';

describe('InicioDespachoComponent', () => {
  let component: InicioDespachoComponent;
  let fixture: ComponentFixture<InicioDespachoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioDespachoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
