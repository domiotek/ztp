import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageBlockComponent } from './chat-message-block.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ChatMessage } from '../../../../../core/models/chat/message.model';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../../core/store/app-state.store';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('ChatMessageBlockComponent', () => {
  let component: ChatMessageBlockComponent;
  let fixture: ComponentFixture<ChatMessageBlockComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      ['sendMessage', 'signalStartedTyping', 'signalStoppedTyping', 'disconnectFromChat'],
      {
        messages$: new BehaviorSubject([]),
        lastReadMessagesMap$: new BehaviorSubject({}),
        lastUserActivityMap$: new BehaviorSubject({}),
        typingUsers$: new BehaviorSubject([]),
        activityTicker$: EMPTY,
        privateChatsUpdates$: EMPTY,
      },
    );

    await TestBed.configureTestingModule({
      imports: [ChatMessageBlockComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ChatService, useValue: mockChatService },
        AppStateStore,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessageBlockComponent);
    fixture.componentRef.setInput('type', 'my');
    fixture.componentRef.setInput('name', 'Test User');
    fixture.componentRef.setInput('surname', 'User');
    const chatMessage: ChatMessage = {
      id: 1,
      content: 'Hello, this is a test message.',
      authorType: 'user',
      sentAt: new Date().toISOString(),
    };
    fixture.componentRef.setInput('messages', [chatMessage]);
    fixture.componentRef.setInput('authorActivityDateTime', '2023-10-01T12:00:00Z');

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
