import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovingDashboard } from './approving-dashboard';

describe('ApprovingDashboard', () => {
  let component: ApprovingDashboard;
  let fixture: ComponentFixture<ApprovingDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovingDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovingDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
