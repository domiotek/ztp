import { Currency } from '../models/currency/currency.model';
import { Event } from '../models/events/event';
import { EventBill, EventCurrency } from '../models/events/event-bill';
import { EventStatus } from '../models/events/event-status.enum';
import { EventSummary } from '../models/events/event-summary';
import { User } from '../models/users/user';

export const mocked_currency: Currency = {
  id: 1,
  name: 'test',
  code: 'USD',
  rate: 1.0,
};

export const mocked_users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
  },
];

export const mocked_event: Event = {
  id: 1,
  name: 'string',
  status: EventStatus.FINISHED,
  startDate: 'string',
  endDate: 'string',
  isFounder: true,
  numberOfNotifications: 1,
  currency: mocked_currency,
  users: mocked_users,
  chatId: 'string',
};

export const mocked_bill: EventBill = {
  id: 1,
  name: '',
  date: '',
  paidBy: mocked_users[0],
  eventCurrency: {
    amount: 1,
    costPerUser: 1,
  },
  userCurrency: {
    amount: 1,
    costPerUser: 1,
  },
};

export const mocked_eventCurrency: EventCurrency = {
  amount: 1,
  costPerUser: 1,
};

export const mocked_summary: EventSummary = {
  eventCurrency: mocked_eventCurrency,
  userCurrency: mocked_eventCurrency,
};
