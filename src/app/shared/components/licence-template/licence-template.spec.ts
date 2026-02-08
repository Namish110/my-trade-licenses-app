import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceTemplate } from './licence-template';

describe('LicenceTemplate', () => {
  let component: LicenceTemplate;
  let fixture: ComponentFixture<LicenceTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenceTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceTemplate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
