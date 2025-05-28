import { EventStatus } from './event-status.enum';

export interface EventFilters {
  name?: string | null;
  eventStatus?: EventStatus | null;
  fromDate?: string | null;
  toDate?: string | null;
}
