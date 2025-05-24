import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TimeRangeSelectorComponent } from '../../../../shared/components/time-range-selector/time-range-selector.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { WidgetWrapperComponent } from '../../components/widget-wrapper/widget-wrapper.component';
import { SpendingSummaryWidgetComponent } from '../../components/spending-summary-widget/spending-summary-widget.component';
import { SpendingsWidgetComponent } from '../../components/spendings-widget/spendings-widget.component';
import { EventsWidgetComponent } from '../../components/events-widget/events-widget.component';
import { CategoriesWidgetComponent } from '../../components/categories-widget/categories-widget.component';
import { DashboardStateStore } from '../../store/dashboard-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY_DASHBOARD_STATE } from '../../constants/empty-dasboard-state';
import { callDebounced as debounceHandler } from '../../../../utils/debouncer';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TimeRangeSelectorComponent,
    WidgetWrapperComponent,
    SpendingSummaryWidgetComponent,
    SpendingsWidgetComponent,
    EventsWidgetComponent,
    CategoriesWidgetComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  timeRange = signal<TimeRange>(EMPTY_DASHBOARD_STATE.timeRange);

  dashboardState = inject(DashboardStateStore);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dashboardState.timeRange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((timeRange) => {
      this.timeRange.set(timeRange);
    });
  }
  projectionRange = computed(() => {
    return {
      from: this.timeRange().from.startOf('month'),
      to: this.timeRange().to.endOf('month'),
    };
  });

  rangeConstraints = computed(() => {
    return {
      max: DateTime.now().endOf('month'),
    };
  });

  addBillButtonDisabled = computed(() => {
    return !this.timeRange().from.equals(DateTime.now().startOf('month'));
  });

  onProjectionDateChange = debounceHandler((timeRange: TimeRange) => {
    this.dashboardState.setTimeRange(timeRange);
  }, 300);
}
