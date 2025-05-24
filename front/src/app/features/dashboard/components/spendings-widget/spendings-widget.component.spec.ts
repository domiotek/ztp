import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingsWidgetComponent } from './spendings-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('SpendingsWidgetComponent', () => {
  let component: SpendingsWidgetComponent;
  let fixture: ComponentFixture<SpendingsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingsWidgetComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
