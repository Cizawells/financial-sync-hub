export class PaymentResponseDto {
  id: string;
  invoice_id: string;
  customer_id: string;
  payment_method_id?: string;
  amount: number;
  payment_date: Date;
  reference_number?: string;
  notes?: string;
  qb_id?: string;
  sync_status: string;
  created_at: Date;
  updated_at: Date;
}
