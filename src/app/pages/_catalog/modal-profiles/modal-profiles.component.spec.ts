import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfilesComponent } from './modal-profiles.component';

describe('ModalProfilesComponent', () => {
  let component: ModalProfilesComponent;
  let fixture: ComponentFixture<ModalProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
