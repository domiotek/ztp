import { Component, OnInit } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

@Component({
  selector: 'app-spendings-widget',
  imports: [],
  templateUrl: './spendings-widget.component.html',
  styleUrl: './spendings-widget.component.scss',
})
export class SpendingsWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
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

  override triggerAction(): void {
    this.routingService.navigate(['/stats']);
  }
}
