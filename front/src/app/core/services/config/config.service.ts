import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ConfigResponse } from '../../models/auth/config-response.model';
import { AppStateStore } from '../../store/app-state.store';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../../models/currency/currency.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly apiUrl = `${environment.apiUrl}`;

  private readonly http = inject(HttpClient);

  private readonly appStateStore = inject(AppStateStore);

  getCurrencyList(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrl}/currencies`).pipe(
      tap((res) => {
        this.appStateStore.setCurrenciesList(res);
      }),
    );
  }

  getConfig(): Observable<ConfigResponse> {
    return this.http.get<ConfigResponse>(`${this.apiUrl}/users/config`).pipe(
      tap((config) => {
        this.appStateStore.setAppState({
          userId: config.id,
          email: config.email,
          firstName: config.firstName,
          currency: config.currency,
          isLogged: true,
        });
      }),
    );
  }
}
