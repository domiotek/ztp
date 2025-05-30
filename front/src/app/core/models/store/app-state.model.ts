import { Currency } from '../currency/currency.model';

export interface AppState {
  userId: number;
  email: string | null;
  firstName: string | null;
  currency: Currency | null;
  currencyList: Currency[];
  isLogged: boolean;
}
