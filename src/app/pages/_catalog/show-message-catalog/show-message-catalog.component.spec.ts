import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMessageCatalogComponent } from './show-message-catalog.component';

describe('ShowMessageCatalogComponent', () => {
  let component: ShowMessageCatalogComponent;
  let fixture: ComponentFixture<ShowMessageCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMessageCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMessageCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
