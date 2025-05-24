import { Component, OnInit } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

@Component({
  selector: 'app-categories-widget',
  imports: [],
  templateUrl: './categories-widget.component.html',
  styleUrl: './categories-widget.component.scss',
})
export class CategoriesWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
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
    this.routingService.navigate(['/categories']);
  }
}
