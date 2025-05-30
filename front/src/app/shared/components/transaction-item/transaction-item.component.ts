import { Component, inject, input } from '@angular/core';
import { Bill } from '../../../core/models/bills/bill.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Currency } from '../../../core/models/currency/currency.model';
import { AppStateStore } from '../../../core/store/app-state.store';
import { map } from 'rxjs';

@Component({
  selector: 'app-transaction-item',
  imports: [CommonModule, MatIconModule, AsyncPipe],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
})
export class TransactionItemComponent {
  private readonly appStateStore = inject(AppStateStore);

  transaction = input.required<Bill>();

  showCategory = input<boolean>(true);

  userCurrency = input.required<Currency>();

  secondCurency$ = this.appStateStore.currencyList$.pipe(
    map((currencies) => currencies.find((c) => c.id !== this.userCurrency().id)),
  );
}
