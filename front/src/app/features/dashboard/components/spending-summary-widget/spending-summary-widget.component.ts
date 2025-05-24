import { Component, OnInit } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
@Component({
  selector: 'app-spending-summary-widget',
  imports: [],
  templateUrl: './spending-summary-widget.component.html',
  styleUrl: './spending-summary-widget.component.scss',
})
export class SpendingSummaryWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  override ngOnInit() {
    this.onInit.next({
      hasInteraction: false,
    });

    super.ngOnInit();
  }

  loadData(): void {
    setTimeout(() => {
      this.onLoad.next();
    }, 1000);
  }

  triggerAction(): void {}
}
