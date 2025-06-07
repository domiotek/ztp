import { AppStateStore } from './../../store/app-state.store';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginRequest } from '../../models/auth/login-request.model';
import { ConfigResponse } from '../../models/auth/config-response.model';
import { ConfigService } from '../config/config.service';
import { RegisterRequest } from '../../models/auth/register-request.model';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);

  private readonly appStateStore = inject(AppStateStore);

  private readonly configService = inject(ConfigService);

  login(credentials: LoginRequest): Observable<ConfigResponse> {
    return this.http.post<void>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap(() => {
        return this.configService.getConfig();
      }),
    );
  }

  register(registrationData: RegisterRequest) {
    return this.http.post<void>(`${this.apiUrl}/register`, registrationData);
  }

  refresh(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/refresh`, {});
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(tap(() => this.appStateStore.logout()));
  }

  sendPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/password-reset/confirm`, { token, newPassword });
  }

  activateAccount(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/activate`, { token });
  }
}
