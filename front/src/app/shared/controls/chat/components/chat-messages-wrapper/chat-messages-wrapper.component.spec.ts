import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesWrapperComponent } from './chat-messages-wrapper.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../../../core/store/app-state.store';
import { ChatStateStore } from '../../store/chat-state.store';
import { ChatService } from '../../../../../core/services/chat/chat.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('ChatMessagesWrapperComponent', () => {
  let component: ChatMessagesWrapperComponent;
  let fixture: ComponentFixture<ChatMessagesWrapperComponent>;
  let mockChatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj(
      'ChatService',
      [
        'sendMessage',
        'signalStartedTyping',
        'signalStoppedTyping',
        'disconnectFromChat',
        'hasMorePages',
        'updateLastReadMessage',
        'getNextChatMessages',
      ],
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
      imports: [ChatMessagesWrapperComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AppStateStore,
        ChatStateStore,
        { provide: ChatService, useValue: mockChatService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessagesWrapperComponent);
    fixture.componentRef.setInput('chatParticipants', []);
    fixture.componentRef.setInput('currentUserId', null);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
