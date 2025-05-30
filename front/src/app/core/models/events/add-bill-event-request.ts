export interface AddBillEventRequest {
  name: string;
  date: string;
  amount: number;
  categoryId: number;
  paidById: number;
}
