export interface BasePagingRequest extends Record<string, string | number | boolean | undefined> {
  from?: string;
  to?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

export interface BasePagingResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
