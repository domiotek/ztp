import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, MatTabsModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit, OnChanges {
  event = input.required<Event>();

  isMobile = input.required<boolean>();

  goBackEmit = output<void>();

  ngOnInit(): void {
    console.log('Selected event:', this.event());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']) {
      console.log('Event changed:', this.event());
    }
  }
}
