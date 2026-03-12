import {
  Customer,
  Invoice,
  InvoiceItem,
  Product,
} from '../../generated/prisma/client.js';

// quickbooks/mappers/invoice.mapper.ts
export class QBInvoiceMapper {
  static toQuickBooks(
    invoice: Invoice & {
      customer: Customer;
      invoice_items: (InvoiceItem & {
        product: Product;
      })[];
    },
  ) {
    if (invoice.qb_id) {
      return {
        Line: invoice.invoice_items.map(
          (
            item: InvoiceItem & {
              product: Product;
            },
          ) => ({
            DetailType: 'SalesItemLineDetail',
            Amount: item.line_total,
            SalesItemLineDetail: {
              ItemRef: {
                value: item.product.qb_id,
                name: item.product.name,
              },
              Qty: item.quantity,
            },
          }),
        ),
        CustomerRef: {
          value: invoice.customer_id,
        },
      };
    } else {
      return {
        Line: invoice.invoice_items.map(
          (
            item: InvoiceItem & {
              product: Product;
            },
          ) => ({
            DetailType: 'SalesItemLineDetail',
            Amount: item.line_total,
            SalesItemLineDetail: {
              ItemRef: {
                value: '30',
                name: 'Shirt',
              },
              Qty: item.quantity,
            },
          }),
        ),
        CustomerRef: {
          value: '70',
        },
      };
    }
  }
}
