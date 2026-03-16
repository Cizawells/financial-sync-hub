import { Prisma } from '../../generated/prisma/client.js';

type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: {
    payment_method: true;
    customer: true;
    invoice?: true;
  };
}>;

export class QBPaymentMapper {
  static toQuickBooks(payment: PaymentWithRelations) {
    const base = {
      TotalAmt: payment.amount.toNumber(),
      CustomerRef: {
        value: payment.customer.qb_id,
      },
      // link payment to invoice if exists
      ...(payment.invoice?.qb_id && {
        Line: [
          {
            Amount: payment.amount.toNumber(),
            LinkedTxn: [
              {
                TxnId: payment.invoice.qb_id, // ← invoice qb_id
                TxnType: 'Invoice',
              },
            ],
          },
        ],
      }),
      // payment method if exists
      ...(payment.payment_method?.qb_id && {
        PaymentMethodRef: {
          value: payment.payment_method.qb_id,
        },
      }),
    };

    // update — include Id and SyncToken
    if (payment.qb_id) {
      return {
        ...base,
        Id: payment.qb_id,
        SyncToken: payment.qb_sync_token ?? undefined,
      };
    }

    // create — no Id or SyncToken
    return base;
  }
}
