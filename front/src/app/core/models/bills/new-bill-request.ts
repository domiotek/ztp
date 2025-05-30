export interface NewBillRequest {
  name: string;
  date: string;
  amount: number;
  currencyId: number;
  categoryId: number;
  eventId?: number;
  paidBy?: number;
  userId?: number;
}
