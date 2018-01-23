import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptosComponent } from './conceptos.component';

describe('ConceptosComponent', () => {
  let component: ConceptosComponent;
  let fixture: ComponentFixture<ConceptosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
