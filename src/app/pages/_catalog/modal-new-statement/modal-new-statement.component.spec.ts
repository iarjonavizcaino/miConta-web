import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewStatementComponent } from './modal-new-statement.component';

describe('ModalNewStatementComponent', () => {
  let component: ModalNewStatementComponent;
  let fixture: ComponentFixture<ModalNewStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
