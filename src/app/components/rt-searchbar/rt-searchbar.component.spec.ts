import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtSearchbarComponent } from './rt-searchbar.component';

describe('RtSearchbarComponent', () => {
  let component: RtSearchbarComponent;
  let fixture: ComponentFixture<RtSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
