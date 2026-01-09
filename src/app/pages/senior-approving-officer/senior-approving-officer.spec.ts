import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorApprovingOfficer } from './senior-approving-officer';

describe('SeniorApprovingOfficer', () => {
  let component: SeniorApprovingOfficer;
  let fixture: ComponentFixture<SeniorApprovingOfficer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorApprovingOfficer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorApprovingOfficer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
