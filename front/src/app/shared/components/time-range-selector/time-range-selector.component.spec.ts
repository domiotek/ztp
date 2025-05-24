import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeSelectorComponent } from './time-range-selector.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';

describe('TimeRangeSelectorComponent', () => {
  let component: TimeRangeSelectorComponent;
  let fixture: ComponentFixture<TimeRangeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangeSelectorComponent],
      providers: [provideExperimentalZonelessChangeDetection(), provideLuxonDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeRangeSelectorComponent);
    fixture.componentRef.setInput('initialTimeRange', { from: DateTime.now(), to: DateTime.now() });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
