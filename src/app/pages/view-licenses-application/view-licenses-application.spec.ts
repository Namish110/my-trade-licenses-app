import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLicensesApplication } from './view-licenses-application';

describe('ViewLicensesApplication', () => {
  let component: ViewLicensesApplication;
  let fixture: ComponentFixture<ViewLicensesApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLicensesApplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewLicensesApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
