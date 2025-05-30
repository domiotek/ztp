import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateTime } from 'luxon';
import { CurrencySelectorComponent } from '../../../../shared/components/currency-selector/currency-selector.component';
import { ApiErrorCode } from '../../../../core/models/error-codes.enum';
import { AlertPanelComponent } from '../../../../shared/components/alert-panel/alert-panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { NewBillRequest } from '../../../../core/models/bills/new-bill-request';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Currency } from '../../../../core/models/currency/currency.model';
import { FormProgressBarComponent } from '../../../../shared/components/form-progress-bar/form-progress-bar.component';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../../core/models/category/category.model';
import { BillsService } from '../../../../core/services/bills/bills.service';
import { CategoryService } from '../../../../core/services/category/category.service';

@Component({
  selector: 'app-add-bill-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    CurrencySelectorComponent,
    AlertPanelComponent,
    MatDatepickerModule,
    MatTimepickerModule,
    FormProgressBarComponent,
    MatSelectModule,
  ],
  templateUrl: './add-bill-dialog.component.html',
  styleUrl: './add-bill-dialog.component.scss',
})
export class AddBillDialogComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3)] }),
    date: new FormControl<string>(DateTime.now().toISODate(), Validators.required),
    time: new FormControl<string>(DateTime.now().toFormat('HH:mm'), Validators.required),
    amount: new FormControl<number>(0, { validators: [Validators.required, Validators.min(0.01)] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    currencyId: new FormControl<number>(0, { validators: [Validators.required] }),
  });

  userDefaultCurrency = signal<Currency | null>(null);
  currencies = signal<Currency[]>([]);
  categories = signal<Category[]>([]);
  errorCode = signal<ApiErrorCode | null>(null);
  submitting = signal<boolean>(false);
  hasSetOtherCurrency = signal(false);

  readonly billsService = inject(BillsService);
  readonly categoryService = inject(CategoryService);
  readonly appStateStore = inject(AppStateStore);
  readonly dialogRef = inject(MatDialogRef<AddBillDialogComponent>);
  readonly destroyRef = inject(DestroyRef);

  get amountInotherCurrencyText() {
    const currentCurrency = this.currencies().find((c) => c.id === this.form.value.currencyId);
    const conversionRate = currentCurrency?.rate;

    if (!conversionRate || conversionRate <= 0 || !this.userDefaultCurrency()) {
      return '';
    }

    const convertedAmount = this.form.value.amount! * conversionRate;

    return `~${convertedAmount.toFixed(2)} ${this.userDefaultCurrency()!.code}`;
  }

  ngOnInit(): void {
    this.appStateStore.appState$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      this.form.patchValue({
        currencyId: state.currency?.id,
      });
      this.userDefaultCurrency.set(state.currency);
      this.currencies.set(state.currencyList ?? []);
    });

    this.form.get('currencyId')!.valueChanges.subscribe((value) => {
      this.hasSetOtherCurrency.set(value !== this.userDefaultCurrency()?.id);
    });

    this.categoryService.getCategoriesList().subscribe((categories) => {
      this.categories.set(categories.content);
    });
  }

  dateFilter(date: DateTime | null): boolean {
    if (!date) return false;
    const today = DateTime.now();
    return date >= today.startOf('month') && date <= today;
  }

  onSubmit() {
    if (!this.form.valid) return;

    const date = DateTime.fromISO(this.form.value.date!);
    const time = DateTime.fromISO(this.form.value.time!);

    const dateTime = date.set({
      hour: time.hour,
      minute: time.minute,
    });

    this.submitting.set(true);
    const billData: NewBillRequest = {
      name: this.form.value.title!,
      date: dateTime.toISO()!,
      amount: this.form.value.amount!,
      categoryId: this.form.value.categoryId!,
      currencyId: this.form.value.currencyId!,
    };

    this.billsService.addBill(billData).subscribe({
      complete: () => {
        this.dialogRef.close();
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorCode.set(err.error?.code);
        this.submitting.set(false);
      },
    });
  }
}
