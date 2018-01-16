import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxpayerCatalogComponent } from './taxpayer-catalog.component';

describe('BillingPage', () => {
  let component: TaxpayerCatalogComponent;
  let fixture: ComponentFixture<TaxpayerCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxpayerCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxpayerCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
