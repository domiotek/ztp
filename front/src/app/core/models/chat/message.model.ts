export interface ChatMessage {
  id: string;
  authorType: 'system' | 'user';
  authorId?: number;
  authorName?: string;
  sentAt: string;
  content: string;
}
