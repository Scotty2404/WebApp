import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatCardComponent } from './pat-card.component';

describe('PatCardComponent', () => {
  let component: PatCardComponent;
  let fixture: ComponentFixture<PatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
