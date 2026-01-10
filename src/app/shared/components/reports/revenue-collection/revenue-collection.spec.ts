import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueCollection } from './revenue-collection';

describe('RevenueCollection', () => {
  let component: RevenueCollection;
  let fixture: ComponentFixture<RevenueCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueCollection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
