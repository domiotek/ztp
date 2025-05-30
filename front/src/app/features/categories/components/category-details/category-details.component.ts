import { BillsService } from './../../../../core/services/bills/bills.service';
import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { Category } from '../../../../core/models/category/category.model';
import { CommonModule } from '@angular/common';
import { CustomListComponent } from '../../../../shared/components/custom-list/custom-list.component';
import { CategoryStateStore } from '../../store/category-state.store';
import { Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Bill } from '../../../../core/models/bills/bill.model';
import { TransactionItemComponent } from '../../../../shared/components/transaction-item/transaction-item.component';
import { Currency } from '../../../../core/models/currency/currency.model';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';
import { MatIconModule } from '@angular/material/icon';
import { BasePagingResponse } from '../../../../core/models/api/paging.model';

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, CustomListComponent, TransactionItemComponent, MatButtonModule, MatIconModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
})
export class CategoryDetailsComponent implements OnInit {
  private readonly billsService = inject(BillsService);

  private readonly categoryStateStore = inject(CategoryStateStore);

  private readonly destroyRef = inject(DestroyRef);

  readonly category = input.required<Category>();

  readonly userCurrency = input.required<Currency>();

  readonly isMobile = input.required<boolean>();

  readonly goBackEmit = output<void>();

  readonly sameMonth = signal<boolean>(true);

  readonly transactions = signal<Bill[]>([]);

  ngOnInit(): void {
    this.getCategoryBills().subscribe();
    this.handleTimeRangeChange();
  }

  protected changeLimit(isExists: boolean): void {
    console.log('Change limit', isExists);
  }

  protected goBack(): void {
    this.goBackEmit.emit();
  }

  private getCategoryBills(): Observable<BasePagingResponse<Bill>> {
    return this.billsService.getBills().pipe(
      tap((res) => {
        this.transactions.set(res.content);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private handleTimeRangeChange(): void {
    this.categoryStateStore.timeRange$
      .pipe(
        tap((res) => {
          this.sameMonth.set(DateTime.now().hasSame(res.from, 'month') && DateTime.now().hasSame(res.from, 'year'));
        }),
        switchMap(() => this.getCategoryBills()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
