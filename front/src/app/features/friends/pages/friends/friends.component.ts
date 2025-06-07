import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, ViewContainerRef, OnInit } from '@angular/core';
import { SearchInputComponent } from '../../../../shared/controls/search-input/search-input.component';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../../../core/services/chat/chat.service';
import { PrivateChat } from '../../../../core/models/chat/chat.model';
import { ChatItemComponent } from '../../components/chat-item/chat-item.component';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../../components/add-friend-dialog/add-friend-dialog.component';
import { PendingFriendRequestsDialogComponent } from '../../components/pending-friend-requests-dialog/pending-friend-requests-dialog.component';
import { CreateNewChatDialogComponent } from '../../components/create-new-chat-dialog/create-new-chat-dialog.component';
import { RemoveFriendDialogComponent } from '../../components/remove-friend-dialog/remove-friend-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { ChatContainerComponent } from '../../components/chat-container/chat-container.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';
import { callDebounced } from '../../../../utils/debouncer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../../../core/models/user/user.model';

@Component({
  selector: 'app-friends',
  imports: [
    CommonModule,
    FormsModule,
    SearchInputComponent,
    CustomListComponent,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ChatItemComponent,
    ChatContainerComponent,
    NgScrollbarModule,
    NgScrollReached,
    MatProgressSpinnerModule,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  readonly isMobile = signal<boolean>(false);
  readonly selectedChat = signal<PrivateChat | null>(null);
  readonly searchValue = signal<string>('');
  readonly chats = signal<PrivateChat[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly currentPage = signal<number>(0);
  readonly hasMorePages = signal<boolean>(true);
  readonly newlyAddedChat = signal<PrivateChat | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private readonly observer = inject(BreakpointObserver);
  private readonly chatsService = inject(ChatService);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  ngOnInit(): void {
    this.observer
      .observe('(max-width: 768px)')
      .pipe(
        tap((res) => {
          this.isMobile.set(res.matches);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.loadMoreChats();

    this.chatsService.privateChatsUpdates$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((chat) => {
      const currentChats = this.chats();
      const existingChatIndex = currentChats.findIndex((c) => c.id === chat.id);

      if (existingChatIndex !== -1) {
        currentChats[existingChatIndex] = chat;
      } else {
        currentChats.unshift(chat);
      }

      this.chats.set(currentChats);
    });
  }

  onSearch(val: string): void {
    this.searchValue.set(val);
    this.chats.set([]);
    this.currentPage.set(0);

    if (this.selectedChat()?.id === this.newlyAddedChat()?.id) {
      this.cleanUpNewlyAddedChat();
      this.selectedChat.set(null);
    }

    this.loadMoreChats();
  }

  unselectChat() {
    this.selectedChat.set(null);
  }

  onChatSelect(chat: PrivateChat): void {
    if (this.newlyAddedChat() && this.newlyAddedChat()?.id !== chat.id) {
      this.cleanUpNewlyAddedChat();
    }

    this.selectedChat.set(chat);
  }

  onScrolledBottom(): void {
    if (this.isLoading() || !this.hasMorePages()) return;

    this.currentPage.update((page) => page + 1);
    this.loadMoreChats();
  }

  openAddFriendDialog(): void {
    this.dialog.open(AddFriendDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }

  openPendingFriendRequestsDialog(): void {
    this.dialog.open(PendingFriendRequestsDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }

  openCreateChatDialog(): void {
    const dialogRef = this.dialog.open(CreateNewChatDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });

    dialogRef.afterClosed().subscribe((result?: User) => {
      if (!result) return;

      this.chatsService.getPrivateChatIdByUserId(result.id).subscribe((chatId) => {
        this.cleanUpNewlyAddedChat();
        const newChat: PrivateChat = {
          id: chatId,
          otherParticipant: result,
          lastMessage: null,
          lastReadMessageId: null,
          isFriend: true,
        };

        this.chats.set([newChat, ...this.chats()]);
        this.selectedChat.set(newChat);
        this.newlyAddedChat.set(newChat);
      });
    });
  }

  openRemoveFriendDialog(): void {
    this.dialog.open(RemoveFriendDialogComponent, {
      data: {},
      viewContainerRef: this.viewContainerRef,
    });
  }
  private readonly loadMoreChats = callDebounced(
    () => {
      this.isLoading.set(true);
      this.chatsService.getPrivateChatsList(this.currentPage(), this.searchValue()).subscribe((chats) => {
        const currentChats = this.chats();
        this.chats.set([...currentChats, ...chats.content]);
        this.isLoading.set(false);
        this.hasMorePages.set(chats.page.number < chats.page.totalPages);
      });
    },
    300,
    this.destroyRef,
  );

  private cleanUpNewlyAddedChat(): void {
    this.chats.set([...this.chats().filter((c) => c.id !== this.newlyAddedChat()?.id)]);
  }
}
