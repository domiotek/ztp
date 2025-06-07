import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { FriendRequest } from '../../models/friend/friend-request.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '../../models/user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FriendService extends BaseApiService {
  private readonly apiUrl = `${environment.apiUrl}/friends`;

  private readonly friendRequests = signal<FriendRequest[]>([]);
  private readonly friends = new BehaviorSubject<User[]>([]);

  readonly friendRequests$: Observable<FriendRequest[]> = toObservable(this.friendRequests);
  readonly friends$: Observable<User[]> = this.friends.asObservable();

  private readonly http = inject(HttpClient);

  getFriendsList(search: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?search=${search}`).pipe(
      tap((friends) => {
        this.friends.next(friends);
      }),
    );
  }

  sendFriendRequest(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/requests`, { email });
  }

  getPendingFriendRequests(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${this.apiUrl}/requests`).pipe(
      tap((requests) => {
        this.friendRequests.set(requests);
      }),
    );
  }

  answerFriendRequest(id: number, accept: boolean): Observable<void> {
    this.friendRequests.update((requests) => {
      return requests.filter((request) => request.id !== id);
    });

    return this.http.put<void>(`${this.apiUrl}/requests/${id}`, { accept });
  }

  removeFriend(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}
