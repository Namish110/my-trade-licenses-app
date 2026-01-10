import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSheet } from './control-sheet';

describe('ControlSheet', () => {
  let component: ControlSheet;
  let fixture: ComponentFixture<ControlSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlSheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
