import { Currency } from '../currency/currency.model';
import { User } from '../users/user';
import { EventBill } from './event-bill';
import { EventSettlements } from './event-settlements';
import { EventStatus } from './event-status.enum';
import { EventSummary } from './event-summary';

export interface Event {
  id: number;
  name: string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  isFounder: boolean;
  numberOfNotifications: number;
  currency: Currency;
  users: User[];
  chatId: string;
}

export interface EventDetails extends Event {
  eventBills?: EventBill[];
  eventUsersWhoPaid?: User[];
  eventSummary?: EventSummary;
  eventSettlements?: EventSettlements[];
}
