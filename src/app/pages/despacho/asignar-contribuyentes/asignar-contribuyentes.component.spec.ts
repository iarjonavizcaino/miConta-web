import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarContribuyentesComponent } from './asignar-contribuyentes.component';

describe('AsignarContribuyentesComponent', () => {
  let component: AsignarContribuyentesComponent;
  let fixture: ComponentFixture<AsignarContribuyentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarContribuyentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarContribuyentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
