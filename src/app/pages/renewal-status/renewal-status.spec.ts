import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalStatus } from './renewal-status';

describe('RenewalStatus', () => {
  let component: RenewalStatus;
  let fixture: ComponentFixture<RenewalStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewalStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
