import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsComponent } from './event-details.component';
import { Event } from '../../../../core/models/events/event';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { mocked_event } from '../../../../core/mocks/tests-mocks';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection(), AppStateStore],
      imports: [EventDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;

    const event: Event = mocked_event;

    fixture.componentRef.setInput('event', event);
    fixture.componentRef.setInput('isMobile', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
