import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLicenceApplicationDetails } from './admin-licence-application-details';

describe('AdminLicenceApplicationDetails', () => {
  let component: AdminLicenceApplicationDetails;
  let fixture: ComponentFixture<AdminLicenceApplicationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLicenceApplicationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLicenceApplicationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
