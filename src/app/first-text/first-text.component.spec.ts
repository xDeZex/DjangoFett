import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTextComponent } from './first-text.component';

describe('FirstTextComponent', () => {
  let component: FirstTextComponent;
  let fixture: ComponentFixture<FirstTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
