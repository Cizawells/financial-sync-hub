import { Prisma, Product } from '../../generated/prisma/client.js';

type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: {
    payment_method: true;
    customer: true;
  };
}>;
// quickbooks/mappers/payment.mapper.ts
export class QBPaymentMapper {
  static toQuickBooks(payment: PaymentWithRelations) {
    if (payment.qb_id) {
      return {
        TotalAmt: payment.amount,
        CustomerRef: {
          value: payment.customer.qb_id,
        },
        Id: payment.qb_id,
        SyncToken: payment.qb_sync_token ? payment.qb_sync_token : undefined,
      };
    } else {
      return {
        TotalAmt: payment.amount,
        CustomerRef: {
          value: payment.customer.qb_id,
        },
        // InvStartDate: payment.
      };
    }
  }
}
