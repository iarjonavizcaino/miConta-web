import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioContadorComponent } from './inicio-contador.component';

describe('InicioContadorComponent', () => {
  let component: InicioContadorComponent;
  let fixture: ComponentFixture<InicioContadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioContadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
