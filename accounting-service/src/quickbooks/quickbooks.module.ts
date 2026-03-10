import { Module } from '@nestjs/common';
import { QuickBooksAuthService } from './quickbooks-auth.service.js';
import { QuickBooksService } from './quickbooks.service.js';
import { QuickBooksController } from './quickbooks.controller.js';
import { QBCustomerService } from './customers/qb-customers.service.js';
import { QBProductService } from './product/qb-product.service.js';
import { QBInvoiceService } from './invoice/qb-invoice.service.js';

@Module({
  controllers: [QuickBooksController],
  providers: [
    QuickBooksAuthService,
    QuickBooksService,
    QBCustomerService,
    QBProductService,
    QBInvoiceService,
  ],
  exports: [
    QuickBooksService,
    QBCustomerService,
    QBProductService,
    QBInvoiceService,
  ],
})
export class QuickbooksModule {}
