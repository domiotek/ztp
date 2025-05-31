import { Observable, ReplaySubject, skip } from 'rxjs';
import { IWidget, IWidgetConfig } from '../../models/widget';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TimeRange } from '../../../../core/models/time-range/time-range';
import { EMPTY_DASHBOARD_STATE } from '../../constants/empty-dasboard-state';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { DashboardStateStore } from '../../store/dashboard-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ template: '' })
export abstract class BaseWidgetComponent implements IWidget, OnInit {
  protected readonly onInit = new ReplaySubject<IWidgetConfig>(1);
  protected readonly onLoad = new ReplaySubject<boolean>(1);
  protected readonly onRefresh = new ReplaySubject<void>(1);

  onInit$: Observable<IWidgetConfig> = this.onInit.asObservable();
  onLoad$: Observable<boolean> = this.onLoad.asObservable();
  onRefresh$: Observable<void> = this.onRefresh.asObservable();

  timeRange = signal<TimeRange>(EMPTY_DASHBOARD_STATE.timeRange);

  routingService = inject(RoutingService);
  dashboardStore = inject(DashboardStateStore);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dashboardStore.timeRange$.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((timeRange) => {
      this.timeRange.set(timeRange);
      this.onRefresh.next();

      this.loadData();
    });

    this.loadData();
  }

  abstract loadData(): void;
  abstract triggerAction(): void;
}
