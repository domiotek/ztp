import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatItemComponent } from './chat-item.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../../core/store/app-state.store';

describe('ChatItemComponent', () => {
  let component: ChatItemComponent;
  let fixture: ComponentFixture<ChatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatItemComponent],
      providers: [provideExperimentalZonelessChangeDetection(), AppStateStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatItemComponent);
    fixture.componentRef.setInput('item', {
      id: 'chat-id',
      lastMessage: null,
      lastReadMessageId: null,
      isFriend: true,
      otherParticipant: {
        firstName: 'John',
      },
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
