import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardWiseLicenses } from './ward-wise-licenses';

describe('WardWiseLicenses', () => {
  let component: WardWiseLicenses;
  let fixture: ComponentFixture<WardWiseLicenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardWiseLicenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardWiseLicenses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
