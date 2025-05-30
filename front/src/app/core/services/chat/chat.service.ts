import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Chat } from '../../models/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  mockedChats: Chat[] = [
    {
      id: 'e34f1c4d-9b1a-4c7d-8f5e-2d3b6c7a8f9d',
      name: 'Konrad',
      lastMessage: {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        authorType: 'system',
        content: 'Welcome to the chat!',
        sentAt: '2023-10-01T12:00:00Z',
      },
      lastReadMessageId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    },
    {
      id: '7a2b9c4d-5e6f-4a1b-9c8d-3f2e1d4b5a6c',
      name: 'Artur',
      lastMessage: {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        authorType: 'user',
        authorId: 2,
        authorName: 'Artur',
        content: 'Dawaj siano',
        sentAt: '2023-10-01T12:00:00Z',
      },
      lastReadMessageId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    },
    {
      id: '1f2e3d4c-5b6a-7890-9c8d-7e6f5d4c3b2a',
      name: 'Mateusz',
      lastMessage: {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        authorType: 'user',
        authorId: 0,
        authorName: 'Damian',
        content: "What's up?",
        sentAt: '2023-10-01T12:00:00Z',
      },
      lastReadMessageId: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    },
  ];

  getChatsList(): Observable<Chat[]> {
    return of([...this.mockedChats]);
  }
}
