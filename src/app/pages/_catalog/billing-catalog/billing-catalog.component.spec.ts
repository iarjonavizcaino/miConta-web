import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCatalogComponent } from './billing-catalog.component';

describe('BillingPage', () => {
  let component: BillingCatalogComponent;
  let fixture: ComponentFixture<BillingCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
