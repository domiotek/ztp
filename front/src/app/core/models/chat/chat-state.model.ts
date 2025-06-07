import { BasePagingResponse } from '../api/paging.model';
import { LastReadMessage } from './last-read-message.model';
import { ChatMessage } from './message.model';

export interface ChatState {
  messages: BasePagingResponse<ChatMessage>;
  userReadMessages: Record<number, LastReadMessage>;
}
