import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceCertificate } from './licence-certificate';

describe('LicenceCertificate', () => {
  let component: LicenceCertificate;
  let fixture: ComponentFixture<LicenceCertificate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceCertificate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceCertificate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
