import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorapprovingDashboard } from './seniorapproving-dashboard';

describe('SeniorapprovingDashboard', () => {
  let component: SeniorapprovingDashboard;
  let fixture: ComponentFixture<SeniorapprovingDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorapprovingDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeniorapprovingDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
