import { Module } from '@nestjs/common';
import { SyncService } from './sync.service.js';
import { QuickbooksModule } from '../quickbooks/quickbooks.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BullModule } from '@nestjs/bullmq';
import { CustomerSyncProcessor } from './processors/customer-sync.processor.js';

@Module({
  providers: [SyncService, CustomerSyncProcessor, PrismaService],
  imports: [
    BullModule.registerQueue({ name: 'customer-sync' }),
    QuickbooksModule,
  ],
})
export class SyncModule {}
