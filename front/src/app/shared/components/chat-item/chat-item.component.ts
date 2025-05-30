import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { Chat } from '../../../core/models/chat/chat.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { AppStateStore } from '../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-chat-item',
  imports: [CommonModule, AvatarComponent, MatIconModule],
  templateUrl: './chat-item.component.html',
  styleUrl: './chat-item.component.scss',
})
export class ChatItemComponent implements OnInit {
  readonly item = input.required<Chat>();
  readonly currentUserId = signal<number>(0);

  get isAuthorOfLastMessage(): boolean {
    return this.item().lastMessage?.authorId === this.currentUserId();
  }

  get isUnread(): boolean {
    return !this.isAuthorOfLastMessage && this.item().lastMessage.id !== this.item().lastReadMessageId;
  }

  get sentDiff(): string {
    return DateTime.fromISO(this.item().lastMessage.sentAt).toRelative() || '';
  }

  readonly appStateStore = inject(AppStateStore);
  readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.appStateStore.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.currentUserId.set(state.userId);
    });
  }
}
