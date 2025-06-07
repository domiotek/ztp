import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Category } from '../../models/category/category.model';
import { map, Observable, tap } from 'rxjs';
import { CategoriesApiRequest } from '../../models/category/get-many.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BasePagingResponse } from '../../models/api/paging.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly categories = signal<Category[]>([]);

  readonly httpClient = inject(HttpClient);

  readonly mockCategories: Category[] = [
    {
      id: 1,
      name: 'Ogólne',
      color: '#65558F',
      limit: 150,
      userCosts: 135,
    },
    {
      id: 2,
      name: 'Jedzenie',
      color: '#F9A826',
      userCosts: 250,
    },
    {
      id: 3,
      name: 'Transport',
      color: '#E74C3C',
      limit: 200,
      userCosts: 180,
    },
    {
      id: 4,
      name: 'Rozrywka',
      color: '#2ECC71',
      limit: 100,
      userCosts: 90,
    },
  ];

  getCategories(): WritableSignal<Category[]> {
    return this.categories;
  }

  getCategoriesList(request?: CategoriesApiRequest): Observable<BasePagingResponse<Category>> {
    const params = new HttpParams({ fromObject: { sortDirection: 'DESC', ...request } });

    return this.httpClient.get<BasePagingResponse<Category>>(`${this.apiUrl}`, { params }).pipe(
      map((res) => ({
        ...res,
        content: Array.isArray(res?.content) && res.content.length > 0 ? res.content : this.mockCategories,
      })),
      tap((res) => {
        if (res?.content && Array.isArray(res.content)) this.categories.set(res.content);
      }),
    );
  }
}
