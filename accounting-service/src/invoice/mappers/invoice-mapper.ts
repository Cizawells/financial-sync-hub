import { Invoice } from 'src/generated/prisma/client.js';
import { InvoiceResponseDto } from '../dto/invoice-response.dto.js';

export class InvoiceMapper {
  static toResponseDto(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      invoice_date: invoice.invoice_date,
      customer_id: invoice.customer_id,
      total_amount: invoice.total_amount.toNumber(),
    };
  }
}
