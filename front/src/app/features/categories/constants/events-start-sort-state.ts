import { SortState } from '../../../core/models/sort/sort-state';
import { EVENTS_SORT_ITEMS } from './events-sort-items';

export const EVENTS_START_SORT_STATE: SortState = {
  value: EVENTS_SORT_ITEMS[0].value,
  direction: 'asc',
};
