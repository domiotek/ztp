import { BasePagingRequest } from '../api/paging.model';

export interface CategoriesApiRequest extends BasePagingRequest {
  name?: string;
}
