import { DateTime } from 'luxon';
import { IEventState } from '../../events/models/event-state';

export const EMPTY_EVENT_STATE: IEventState = {
  timeRange: {
    from: DateTime.now().startOf('month'),
    to: DateTime.now().endOf('month'),
  },
};
