import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY_DASHBOARD_STATE } from '../constants/empty-dasboard-state';
import { TimeRange } from '../../../core/models/time-range/time-range';
import { IDashboardState } from '../models/dashboard-state';

@Injectable({ providedIn: 'root' })
export class DashboardStateStore extends ComponentStore<IDashboardState> {
  constructor() {
    super(EMPTY_DASHBOARD_STATE);
  }

  readonly timeRange$ = this.select((state) => state.timeRange);

  readonly setTimeRange = this.updater((state, timeRange: TimeRange) => ({
    ...state,
    timeRange,
  }));
}
