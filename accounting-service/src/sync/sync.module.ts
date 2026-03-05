import { Module } from '@nestjs/common';
import { QuickbooksModule } from '../quickbooks/quickbooks.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BullModule } from '@nestjs/bullmq';
import { CustomerSyncProcessor } from './customer/customer-sync.processor.js';
import { productSyncService } from './product/product-sync.service.js';
import { CustomerSyncService } from './customer/customer-sync.service.js';
import { ProductSyncProcessor } from './product/product.sync.processor.js';

@Module({
  providers: [
    CustomerSyncService,
    CustomerSyncProcessor,
    PrismaService,
    productSyncService,
    ProductSyncProcessor,
  ],
  imports: [
    BullModule.registerQueue(
      { name: 'customer-sync' },
      { name: 'product-sync' },
    ),
    QuickbooksModule,
  ],
})
export class SyncModule {}
