import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingSummaryWidgetComponent } from './spending-summary-widget/spending-summary-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SpendingSummaryWidgetComponent', () => {
  let component: SpendingSummaryWidgetComponent;
  let fixture: ComponentFixture<SpendingSummaryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryWidgetComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
