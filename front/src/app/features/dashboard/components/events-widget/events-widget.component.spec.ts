import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsWidgetComponent } from './events-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('EventsWidgetComponent', () => {
  let component: EventsWidgetComponent;
  let fixture: ComponentFixture<EventsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsWidgetComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
