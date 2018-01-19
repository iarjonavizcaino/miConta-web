import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStatementFileComponent } from './upload-statement-file.component';

describe('UploadStatementFileComponent', () => {
  let component: UploadStatementFileComponent;
  let fixture: ComponentFixture<UploadStatementFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadStatementFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadStatementFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
