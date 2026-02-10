import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLicenceApplications } from './admin-licence-applications';

describe('AdminLicenceApplications', () => {
  let component: AdminLicenceApplications;
  let fixture: ComponentFixture<AdminLicenceApplications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLicenceApplications]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLicenceApplications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
