import { User } from '../users/user';
import { EventStatus } from './event-status.enum';

export interface Event {
  id: number;
  name: string;
  status: EventStatus;
  isFounder: boolean;
  numberOfNotifications: number;
  currencyId: number;
  users: User[];
}
