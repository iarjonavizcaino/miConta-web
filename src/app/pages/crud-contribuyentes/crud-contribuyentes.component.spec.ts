import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudContribuyentesComponent } from './crud-contribuyentes.component';

describe('CrudContribuyentesComponent', () => {
  let component: CrudContribuyentesComponent;
  let fixture: ComponentFixture<CrudContribuyentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudContribuyentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudContribuyentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
