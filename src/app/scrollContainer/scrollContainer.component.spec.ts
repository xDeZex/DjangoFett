import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockScrollComponent } from './scrollContainer.component';

describe('ClockScrollComponent', () => {
  let component: ClockScrollComponent;
  let fixture: ComponentFixture<ClockScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClockScrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
