import { Invoice, InvoiceItem } from '../../generated/prisma/client.js';

// quickbooks/mappers/invoice.mapper.ts
export class QBInvoiceMapper {
  static toQuickBooks(
    invoice: Invoice & {
      invoice_items: InvoiceItem[];
    },
  ) {
    if (invoice.qb_id) {
      return {
        Line: invoice.invoice_items.map((item: InvoiceItem) => ({
          DetailType: 'SalesItemLineDetail',
          Amount: item.line_total,
          SalesItemLineDetail: {
            ItemRef: {
              value: item.product_id,
            },
          },
        })),
        CustomerRef: {
          value: invoice.customer_id,
        },
      };
    } else {
      return {
        Line: invoice.invoice_items.map((item: InvoiceItem) => ({
          DetailType: 'SalesItemLineDetail',
          Amount: item.line_total,
          SalesItemLineDetail: {
            ItemRef: {
              name: item.product_id,
              value: item.product_id,
            },
          },
        })),
        CustomerRef: {
          value: invoice.customer_id,
        },
      };
    }
  }
}
