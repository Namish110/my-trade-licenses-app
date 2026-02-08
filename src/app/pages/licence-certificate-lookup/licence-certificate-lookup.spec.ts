import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceCertificateLookup } from './licence-certificate-lookup';

describe('LicenceCertificateLookup', () => {
  let component: LicenceCertificateLookup;
  let fixture: ComponentFixture<LicenceCertificateLookup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceCertificateLookup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceCertificateLookup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
