import { PaginationResponse } from '../pagination/pagination-response';

export interface EventResponse {
  content: Event[];
  page: PaginationResponse;
}
