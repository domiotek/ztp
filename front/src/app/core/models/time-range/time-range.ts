import { DateTime } from 'luxon';

export interface TimeRange {
  from: DateTime;
  to: DateTime;
}

export interface TimeRangeConstraints {
  min?: DateTime;
  max?: DateTime;
}
