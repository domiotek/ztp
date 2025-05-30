import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Friend } from '../../models/friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  getFriendsList(): Observable<Friend[]> {
    return of([
      {
        id: 1,
        name: 'Damian',
      },
      {
        id: 2,
        name: 'Artur',
      },
      {
        id: 3,
        name: 'Konrad',
      },
      {
        id: 4,
        name: 'Mateusz',
      },
    ]);
  }
}
