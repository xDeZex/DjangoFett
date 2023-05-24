import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonjComponent } from './konj.component';

describe('KonjComponent', () => {
  let component: KonjComponent;
  let fixture: ComponentFixture<KonjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KonjComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
