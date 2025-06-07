import { UpdateEventBillRequest } from '../../models/events/update-event-bill-request';
import { Observable, Subject, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventResponse } from '../../models/events/event-response';
import { EventFilters } from '../../models/events/event-filters';
import { Pagination } from '../../models/pagination/pagination';
import { EventBillResponse } from '../../models/events/event-bills-reponse';
import { EventSummary } from '../../models/events/event-summary';
import { EventSettlements } from '../../models/events/event-settlements';
import { CreateEventRequest } from '../../models/events/create-event-request';
import { AddBillEventRequest } from '../../models/events/add-bill-event-request';
import { BaseApiService } from '../base-api.service';
import { DateTime } from 'luxon';
import { UpdateEventRequest } from '../../models/events/update-event-request';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  private readonly http = inject(HttpClient);

  private readonly billRefreshSubject = new Subject<void>();

  private readonly eventRefreshSubject = new Subject<void>();

  billRefresh$ = this.billRefreshSubject.asObservable();

  eventRefresh$ = this.eventRefreshSubject.asObservable();

  emitBillRefresh(): void {
    this.billRefreshSubject.next();
  }

  emitEventRefresh(): void {
    this.eventRefreshSubject.next();
  }

  readonly events = signal<Event[]>([]);

  getEvents(filters: EventFilters, pagination: Pagination): Observable<EventResponse> {
    let params = new HttpParams().set('page', pagination.page.toString()).set('size', pagination.size.toString());

    if (filters.name) params = params.set('name', filters.name);
    if (filters.eventStatus) params = params.set('eventStatus', filters.eventStatus);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);

    return this.http.get<EventResponse>(this.apiUrl, { params }).pipe(
      tap((res) => {
        const eventsMockedDate = res.content.map((event) => ({
          ...event,
          startDate: DateTime.now().minus({ days: 1 }).toISO(),
          endDate: DateTime.now().plus({ days: 1 }).toISO(),
        }));
        this.events.set(eventsMockedDate);
      }),
    );
  }

  getEventSummary(eventId: number): Observable<EventSummary> {
    return this.http.get<EventSummary>(`${this.apiUrl}/${eventId}/summary`);
  }

  getEventBills(eventId: number, pagination: Pagination): Observable<EventBillResponse> {
    let params = new HttpParams().set('page', pagination.page.toString()).set('size', pagination.size.toString());

    return this.http.get<EventBillResponse>(`${this.apiUrl}/${eventId}/bills`, { params });
  }

  getSettlements(eventId: number): Observable<EventSettlements[]> {
    return this.http.get<EventSettlements[]>(`${this.apiUrl}/${eventId}/settlements`);
  }

  getEventUsersWhoPaid(eventId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${eventId}/users-who-paid`);
  }

  createEvent(req: CreateEventRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, req).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie utworzono wydarzenie
      }),
    );
  }

  addUserToEvent(eventId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${eventId}/users/${userId}`, {}).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie dodano użytkownika do wydarzenia
      }),
    );
  }

  addBillToEvent(eventId: number, bill: AddBillEventRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${eventId}/bills`, bill).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie dodano rachunek do wydarzenia
      }),
    );
  }

  updateEvent(eventId: number, req: UpdateEventRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${eventId}`, req).pipe(tap(() => {}));
  }

  updateEventBill(eventId: number, billId: number, req: UpdateEventBillRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${eventId}/bills/${billId}`, req).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie zaktualizowano wydarzenie
      }),
    );
  }

  deleteEventBill(eventId: number, billId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/bills/${billId}`).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie usunięto rachunek z wydarzenia
      }),
    );
  }

  deleteUserFromEvent(eventId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/users/${userId}`).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie usunięto użytkownika z wydarzenia
      }),
    );
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie usunięto wydarzenie
      }),
    );
  }
}
