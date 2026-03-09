import { Controller, Get } from '@nestjs/common';
import { InvoiceService } from './invoice.service.js';

@Controller('/invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}
  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }
}
