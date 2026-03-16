import { Payment } from '../../generated/prisma/client.js';

import { PaymentResponseDto } from '../dto/payment-response.dto.js';

export class PaymentMapper {
  static toResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      amount: payment.amount.toNumber(),
      created_at: payment.created_at,
      customer_id: payment.customer_id,
      invoice_id: payment.invoice_id,
      payment_date: payment.payment_date,
      sync_status: payment.sync_status,
      updated_at: payment.updated_at,
      notes: payment.notes ?? undefined, // ← null to undefined
      payment_method_id: payment.payment_method_id ?? undefined,
      qb_id: payment.qb_id ?? undefined,
      reference_number: payment.reference_number ?? undefined,
    };
  }
}
