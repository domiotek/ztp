import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { skip } from 'rxjs';
import { IWidget } from '../../models/widget';
import { RoutingService } from '../../../../core/services/routing/routing.service';
import { DashboardStateStore } from '../../store/dashboard-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

@Component({
  selector: 'app-events-widget',
  imports: [],
  templateUrl: './events-widget.component.html',
  styleUrl: './events-widget.component.scss',
})
export class EventsWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  override ngOnInit() {
    this.onInit.next({
      hasInteraction: true,
    });

    super.ngOnInit();
  }

  loadData(): void {
    setTimeout(() => {
      this.onLoad.next();
    }, 1000);
  }

  triggerAction(): void {
    this.routingService.navigate(['/events']);
  }
}
