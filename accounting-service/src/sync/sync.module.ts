import { Module } from '@nestjs/common';
import { QuickbooksModule } from '../quickbooks/quickbooks.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BullModule } from '@nestjs/bullmq';
import { CustomerSyncProcessor } from './customer/customer-sync.processor.js';
import { productSyncService } from './product/product-sync.service.js';
import { CustomerSyncService } from './customer/customer-sync.service.js';
import { ProductSyncProcessor } from './product/product.sync.processor.js';
import { InvoiceSyncService } from './invoice/invoice-sync.service.js';
import { InvoiceSyncProcessor } from './invoice/invoice-sync.processor.js';
import { PaymentSyncProcessor } from './payment/payment.sync.processor.js';
import { PaymentSyncService } from './payment/payment-sync.service.js';

@Module({
  providers: [
    CustomerSyncService,
    CustomerSyncProcessor,
    PrismaService,
    productSyncService,
    ProductSyncProcessor,
    InvoiceSyncService,
    InvoiceSyncProcessor,
    PaymentSyncProcessor,
    PaymentSyncService,
  ],
  imports: [
    BullModule.registerQueue(
      { name: 'customer-sync' },
      { name: 'product-sync' },
      { name: 'invoice-sync' },
      { name: 'payment-sync' },
    ),
    QuickbooksModule,
  ],
})
export class SyncModule {}
