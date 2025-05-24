import { DateTime } from 'luxon';
import { IDashboardState } from '../models/dashboard-state';

export const EMPTY_DASHBOARD_STATE: IDashboardState = {
  timeRange: {
    from: DateTime.now().startOf('month'),
    to: DateTime.now().endOf('month'),
  },
};
