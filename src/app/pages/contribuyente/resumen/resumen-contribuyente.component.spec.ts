import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenContribuyenteComponent } from './resumen-contribuyente.component';

describe('ResumenContribuyenteComponent', () => {
  let component: ResumenContribuyenteComponent;
  let fixture: ComponentFixture<ResumenContribuyenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenContribuyenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenContribuyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
