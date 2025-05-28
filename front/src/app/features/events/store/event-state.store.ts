import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { IEventState } from '../models/event-state';
import { EMPTY_EVENT_STATE } from '../../categories/constants/empty-event-state';

@Injectable({ providedIn: 'root' })
export class EventStateStore extends ComponentStore<IEventState> {
  constructor() {
    super(EMPTY_EVENT_STATE);
  }

  readonly timeRange$ = this.select((state) => state.timeRange);

  readonly setTimeRange = this.updater((state, timeRange: TimeRange) => ({
    ...state,
    timeRange,
  }));
}
