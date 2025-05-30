import { Component, inject, OnInit, signal } from '@angular/core';
import { IWidget } from '../../models/widget';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { TransactionItemComponent } from '../../../../shared/components/transaction-item/transaction-item.component';
import { Bill } from '../../../../core/models/bills/bill.model';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { BillsService } from '../../../../core/services/bills/bills.service';

@Component({
  selector: 'app-spendings-widget',
  imports: [CommonModule, CustomListComponent, TransactionItemComponent],
  templateUrl: './spendings-widget.component.html',
  styleUrl: './spendings-widget.component.scss',
})
export class SpendingsWidgetComponent extends BaseWidgetComponent implements IWidget, OnInit {
  readonly bills = signal<Bill[]>([]);

  readonly billsService = inject(BillsService);
  readonly appStateStore = inject(AppStateStore);

  override ngOnInit() {
    this.onInit.next({
      hasInteraction: true,
    });

    super.ngOnInit();
  }

  loadData(): void {
    this.billsService
      .getBills({ size: 5, from: this.timeRange().from.toISO()!, to: this.timeRange().to.toISO()! })
      .subscribe({
        next: (bills) => {
          this.bills.set(bills.content);
          this.onLoad.next(true);
        },
        error: () => {
          this.onLoad.next(false);
        },
      });
  }

  override triggerAction(): void {
    this.routingService.navigate(['/stats'], { timeRange: this.timeRange() });
  }
}
