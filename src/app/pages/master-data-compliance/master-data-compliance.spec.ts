import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataCompliance } from './master-data-compliance';

describe('MasterDataCompliance', () => {
  let component: MasterDataCompliance;
  let fixture: ComponentFixture<MasterDataCompliance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDataCompliance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataCompliance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
