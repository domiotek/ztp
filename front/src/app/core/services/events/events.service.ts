import { Observable, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventResponse } from '../../models/events/event-response';
import { EventFilters } from '../../models/events/event-filters';
import { Pagination } from '../../models/pagination/pagination';
import { EventBillResponse } from '../../models/events/event-bills-reponse';
import { EventSummary } from '../../models/events/event-summary';
import { EventSettlements } from '../../models/events/event-settlements';
import { CreateEventRequest } from '../../models/events/create-event-request';
import { AddBillEventRequest } from '../../models/events/add-bill-event-request';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly apiUrl = `${environment.apiUrl}/events`;

  private readonly http = inject(HttpClient);

  readonly events = signal<Event[]>([]);

  getEvents(filters: EventFilters, pagination: Pagination): Observable<EventResponse> {
    let params = new HttpParams().set('page', pagination.page.toString()).set('size', pagination.size.toString());

    if (filters.name) params = params.set('name', filters.name);
    if (filters.eventStatus) params = params.set('eventStatus', filters.eventStatus);
    if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
    if (filters.toDate) params = params.set('toDate', filters.toDate);

    return this.http.get<EventResponse>(this.apiUrl, { params }).pipe(
      tap((res) => {
        this.events.set(res.content);
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

  deleteUserFromEvent(eventId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/users/${userId}`).pipe(
      tap(() => {
        // tutaj będzie toast że pomyślnie usunięto użytkownika z wydarzenia
      }),
    );
  }
}
