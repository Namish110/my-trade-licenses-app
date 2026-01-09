import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeLicenseRegistration } from './trade-license-registration';

describe('TradeLicenseRegistration', () => {
  let component: TradeLicenseRegistration;
  let fixture: ComponentFixture<TradeLicenseRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeLicenseRegistration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeLicenseRegistration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
