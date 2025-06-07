import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventDialogComponent } from './add-event-dialog.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppStateStore } from '../../../../core/store/app-state.store';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';
import { EventDetails } from '../../../../core/models/events/event';
import { EventStatus } from '../../../../core/models/events/event-status.enum';
import { Currency } from '../../../../core/models/currency/currency.model';
import { User } from '../../../../core/models/users/user';

describe('AddEventDialogComponent', () => {
  let component: AddEventDialogComponent;
  let fixture: ComponentFixture<AddEventDialogComponent>;

  const currency: Currency = {
    id: 1,
    name: 'test',
    code: 'USD',
    rate: 1.0,
  };

  const users: User[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    },
  ];

  const data: EventDetails = {
    id: 1,
    name: 'string',
    status: EventStatus.FINISHED,
    startDate: 'string',
    endDate: 'string',
    isFounder: true,
    numberOfNotifications: 1,
    currency: currency,
    users: users,
    chatId: 'string',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
        provideHttpClient(),
        provideHttpClientTesting(),
        AppStateStore,
        provideLuxonDateAdapter(),
      ],
      imports: [AddEventDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
