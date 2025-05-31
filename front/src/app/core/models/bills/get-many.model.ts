import { BasePagingRequest } from '../api/paging.model';

export interface BillsApiRequest extends BasePagingRequest {
  categoryId?: number;
}
