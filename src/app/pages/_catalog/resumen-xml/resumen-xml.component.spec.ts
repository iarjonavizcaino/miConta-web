import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenXmlComponent } from './resumen-xml.component';

describe('ResumenXmlComponent', () => {
  let component: ResumenXmlComponent;
  let fixture: ComponentFixture<ResumenXmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenXmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
