import { Category } from '../category/category.model';

export interface Bill {
  id: number;
  name: string;
  date: string;
  amount: number;
  category: Category;
  userValue: number;
  billValue: number;
  currencyId: number;
}
