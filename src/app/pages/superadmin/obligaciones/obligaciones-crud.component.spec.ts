import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionesCrudComponent } from './obligaciones-crud.component';

describe('ObligacionesCrudComponent', () => {
  let component: ObligacionesCrudComponent;
  let fixture: ComponentFixture<ObligacionesCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionesCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
