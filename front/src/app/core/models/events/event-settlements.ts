import { User } from '../users/user';

export interface EventSettlements {
  user: User;
  settlements: Settlements;
}

export interface Settlements {
  eventCurrency: number;
  userCurrency: number;
}
