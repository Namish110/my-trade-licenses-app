import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotRenewedLicenses } from './not-renewed-licenses';

describe('NotRenewedLicenses', () => {
  let component: NotRenewedLicenses;
  let fixture: ComponentFixture<NotRenewedLicenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotRenewedLicenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotRenewedLicenses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
