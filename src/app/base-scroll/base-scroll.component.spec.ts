import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseScrollComponent } from './base-scroll.component';

describe('BaseScrollComponent', () => {
  let component: BaseScrollComponent;
  let fixture: ComponentFixture<BaseScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseScrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
