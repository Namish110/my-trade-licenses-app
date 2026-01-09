import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverRenewalList } from './approver-renewal-list';

describe('ApproverRenewalList', () => {
  let component: ApproverRenewalList;
  let fixture: ComponentFixture<ApproverRenewalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproverRenewalList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproverRenewalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
