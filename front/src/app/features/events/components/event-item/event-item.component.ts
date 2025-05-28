import { Component, input } from '@angular/core';
import { Event } from '../../../../core/models/events/event';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-item',
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss',
})
export class EventItemComponent {
  event = input.required<Event>();
}
