export interface CreateEventRequest {
  name: string;
  currencyId: number;
  startDate: string;
  endDate: string;
  users: number[];
}
