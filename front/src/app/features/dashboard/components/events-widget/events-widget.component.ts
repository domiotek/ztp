import { Component, OnInit } from '@angular/core';
import { IWidget } from '../../models/widget';
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
      this.onLoad.next(true);
    }, 1000);
  }

  triggerAction(): void {
    this.routingService.navigate(['/events']);
  }
}
