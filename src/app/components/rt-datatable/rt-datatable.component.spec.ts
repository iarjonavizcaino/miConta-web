import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtDatatableComponent } from './rt-datatable.component';

describe('RtDatatableComponent', () => {
  let component: RtDatatableComponent;
  let fixture: ComponentFixture<RtDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
