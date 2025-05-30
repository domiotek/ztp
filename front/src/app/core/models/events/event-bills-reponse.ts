import { PaginationResponse } from '../pagination/pagination-response';
import { EventBill } from './event-bill';

export interface EventBillResponse {
  content: EventBill[];
  page: PaginationResponse;
}
