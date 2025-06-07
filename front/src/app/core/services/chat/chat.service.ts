import { DestroyRef, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { PrivateChat } from '../../models/chat/chat.model';
import { ChatMessage } from '../../models/chat/message.model';
import { BasePagingResponse } from '../../models/api/paging.model';
import { IMessage } from '@stomp/stompjs';
import { environment } from '../../../environments/environment';
import SockJS from 'sockjs-client/dist/sockjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppStateStore } from '../../store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DEFAULT_CHAT_PAGE_SIZE } from '../../../shared/controls/chat/constants/chat.const';
import { RxStomp } from '@stomp/rx-stomp';
import { UserTypingEvent } from '../../models/chat/user-typing-event.model';
import { UserReadMessageEvent } from '../../models/chat/user-read-message-event.model';
import { UserAvailabilityEvent } from '../../models/chat/user-availability-event.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private readonly currentUserId = signal<number | null>(null);

  private readonly connectedChatId = new BehaviorSubject<string | null>(null);
  private readonly privateChatsUpdates = new Subject<PrivateChat>();
  private readonly typingUsers = new BehaviorSubject<number[]>([]);
  private readonly messages = new BehaviorSubject<ChatMessage[]>([]);
  private readonly lastReadMessagesMap = new BehaviorSubject<Record<number, string>>({});
  private readonly lastUserActivityMap = new BehaviorSubject<Record<number, string>>({});

  readonly privateChatsUpdates$ = this.privateChatsUpdates.asObservable();
  readonly typingUsers$ = this.typingUsers.asObservable();
  readonly messages$ = this.messages.asObservable();
  readonly lastReadMessagesMap$ = this.lastReadMessagesMap.asObservable();
  readonly lastUserActivityMap$ = this.lastUserActivityMap.asObservable();

  private readonly stompClient: RxStomp;
  private readonly http = inject(HttpClient);
  private readonly appStateStore = inject(AppStateStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.stompClient = new RxStomp();
    this.stompClient.configure({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws/chats`),
      reconnectDelay: 5000,
    });

    this.stompClient.activate();

    this.appStateStore.appState$.pipe(takeUntilDestroyed()).subscribe((state) => {
      this.currentUserId.set(state.userId);
    });

    this.stompClient
      .watch(`/${this.currentUserId()}/private-chat-updates`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const chat: PrivateChat = JSON.parse(message.body);

        this.privateChatsUpdates.next(chat);
      });
  }

  ngOnDestroy(): void {
    this.stompClient.deactivate();
  }

  getPrivateChatsList(offset: number, searchQuery: string): Observable<BasePagingResponse<PrivateChat>> {
    const params = new HttpParams();

    params.set('offset', offset.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    }

    return this.http.get<BasePagingResponse<PrivateChat>>(`${environment.apiUrl}/chats/private`, { params });
  }

  getUserIdsWithPrivateChat(): Observable<number[]> {
    return this.http.get<number[]>(`${environment.apiUrl}/chats/private/user-ids`);
  }

  getPrivateChatIdByUserId(userId: number): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/chats/private/${userId}`);
  }

  connectToChat(chatId: string) {
    this.connectedChatId.next(chatId);

    this.stompClient
      .watch(`/${chatId}/message`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.messages.next([...this.messages.value, chatMessage]);
      });

    this.stompClient
      .watch(`/${chatId}/user-started-typing`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const event: UserTypingEvent = JSON.parse(message.body);

        if (typeof event.userId !== 'number') return;

        if (event.userId === this.currentUserId()) return;

        this.typingUsers.next([...this.typingUsers.value, event.userId]);
      });

    this.stompClient
      .watch(`/${chatId}/user-stopped-typing`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const event: UserTypingEvent = JSON.parse(message.body);

        if (typeof event.userId !== 'number') return;

        this.typingUsers.next([...this.typingUsers.value.filter((id) => id !== event.userId)]);
      });

    this.stompClient
      .watch(`/${chatId}/user-read-message`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const event: UserReadMessageEvent = JSON.parse(message.body);

        if (typeof event.userId !== 'number') return;

        if (typeof event.messageId !== 'string') return;

        if (event.userId === this.currentUserId()) return;

        this.lastReadMessagesMap.next({
          ...this.lastReadMessagesMap.value,
          [event.userId]: event.messageId,
        });
      });

    this.stompClient
      .watch(`/${chatId}/user-last-activity`)
      .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this.connectedChatId.asObservable()))
      .subscribe((message: IMessage) => {
        const event: UserAvailabilityEvent = JSON.parse(message.body);

        if (typeof event.userId !== 'number') return;

        if (event.userId === this.currentUserId()) return;

        this.lastUserActivityMap.next({
          ...this.lastUserActivityMap.value,
          [event.userId]: event.lastSeenAt,
        });
      });
  }

  sendMessage(message: string) {
    return this.stompClient.publish({
      destination: `/${this.connectedChatId.value}/post-message`,
      body: message,
    });
  }

  getNextChatMessages(lastFetchedMessageId: string | null): Observable<BasePagingResponse<ChatMessage>> {
    let params = new HttpParams();

    if (lastFetchedMessageId) {
      params = params.set('fromMessage', lastFetchedMessageId);
    }

    params = params.set('amount', DEFAULT_CHAT_PAGE_SIZE.toString());

    return this.http.get<BasePagingResponse<ChatMessage>>(
      `${environment.apiUrl}/chats/${this.connectedChatId.value}/messages`,
      {
        params,
      },
    );
  }

  signalStartedTyping(): void {
    if (!this.ensureConnected()) return;

    this.stompClient.publish({
      destination: `/${this.connectedChatId.value}/started-typing`,
    });
  }

  signalStoppedTyping(): void {
    if (!this.ensureConnected()) return;

    this.stompClient.publish({
      destination: `/${this.connectedChatId.value}/stopped-typing`,
    });
  }

  updateLastActivity(): void {
    if (!this.ensureConnected()) return;

    this.stompClient.publish({
      destination: `/${this.connectedChatId.value}/report-last-activity`,
    });
  }

  updateLastReadMessage(messageId: string): void {
    if (!this.ensureConnected()) return;

    const lastReadMessages = this.lastReadMessagesMap.value;

    if (lastReadMessages[this.currentUserId()!] !== messageId) {
      this.stompClient.publish({
        destination: `/${this.connectedChatId.value}/update-last-read-message`,
        body: JSON.stringify({ messageId }),
      });
    }
  }

  private ensureConnected(): boolean {
    return this.connectedChatId.value !== null && this.currentUserId() !== null && this.stompClient.connected();
  }
}
