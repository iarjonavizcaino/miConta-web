import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewItemProductComponent } from './new-item-product.component';

describe('NewItemProductComponent', () => {
  let component: NewItemProductComponent;
  let fixture: ComponentFixture<NewItemProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewItemProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewItemProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
