import { Observable, tap } from 'rxjs';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EventResponse } from '../../models/events/event-response';
import { EventFilters } from '../../models/events/event-filters';
import { Pagination } from '../../models/pagination/pagination';

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
}
