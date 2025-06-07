import { CommonModule } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { EventDetailsBillsComponent } from '../event-details-bills/event-details-bills.component';
import { EventDetailsUsersComponent } from '../event-details-users/event-details-users.component';
import { EventDetailsSettlementsComponent } from '../event-details-settlements/event-details-settlements.component';
import { EventDetailsSettingsComponent } from '../event-details-settings/event-details-settings.component';
import { Event } from '../../../../core/models/events/event';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChatComponent } from '../../../../shared/controls/chat/chat.component';

@Component({
  selector: 'app-event-details',
  imports: [
    CommonModule,
    MatTabsModule,
    EventDetailsBillsComponent,
    EventDetailsUsersComponent,
    EventDetailsSettlementsComponent,
    EventDetailsSettingsComponent,
    MatButtonModule,
    MatIconModule,
    ChatComponent,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent {
  private readonly appStateStore = inject(AppStateStore);

  event = model.required<Event>();

  isMobile = input.required<boolean>();

  goBackEmit = output<void>();

  readonly userCurrency$ = this.appStateStore.userDefaultCurrency$;

  readonly userId$ = this.appStateStore.userId;

  protected userDeletion(userId: number): void {
    this.event.set({ ...this.event(), users: this.event().users.filter((user) => user.id !== userId) });
  }

  protected goBack(): void {
    this.goBackEmit.emit();
  }
}
