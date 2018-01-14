import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionesComponent } from './obligaciones.component';

describe('ObligacionesComponent', () => {
  let component: ObligacionesComponent;
  let fixture: ComponentFixture<ObligacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
