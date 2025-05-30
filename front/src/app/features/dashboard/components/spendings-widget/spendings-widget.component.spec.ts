import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingsWidgetComponent } from './spendings-widget.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { BillsService } from '../../../../core/services/bills/bills.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SpendingsWidgetComponent', () => {
  let component: SpendingsWidgetComponent;
  let fixture: ComponentFixture<SpendingsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingsWidgetComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        AppStateStore,
        BillsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
