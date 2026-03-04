// sync/sync.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QuickBooksService } from '../../quickbooks/quickbooks.service.js';

@Processor('customer-sync')
export class CustomerSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(CustomerSyncProcessor.name);

  constructor(
    private prisma: PrismaService,
    private qbService: QuickBooksService,
  ) {
    super();
  }

  async process(job: Job<{ customerId: string; action: string }>) {
    switch (job.name) {
      case 'create':
        return this.handleCreate(job);
      case 'update':
        return this.handleUpdate(job);
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  private async handleCreate(job: Job<{ customerId: string }>) {
    const { customerId } = job.data;

    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'customer',
        entity_id: customerId,
        action: 'create',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch customer
      const customer = await this.prisma.customer.findUniqueOrThrow({
        where: { id: customerId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } = await this.qbService.createCustomer(customer);

      // 4. Save QB id back to customer record
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { qb_id: Id, qb_sync_token: SyncToken },
      });

      // 5. Mark log success
      await this.prisma.syncLog.update({
        where: { id: log.id },
        data: {
          status: 'success',
          qb_id: Id,
          attempts: job.attemptsMade,
        },
      });
    } catch (error) {
      // 6. Mark log failed
      await this.prisma.syncLog.update({
        where: { id: log.id },
        data: {
          status: 'failed',
          error: error.message,
          attempts: job.attemptsMade,
        },
      });

      this.logger.error(
        `❌ Sync failed for customer ${customerId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }
  private async handleUpdate(job: Job<{ customerId: string }>) {
    const { customerId } = job.data;

    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'customer',
        entity_id: customerId,
        action: 'update',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch customer
      const customer = await this.prisma.customer.findUniqueOrThrow({
        where: { id: customerId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } = await this.qbService.updateCustomer(customer);

      // 4. Save QB synctoken back to customer record
      await this.prisma.customer.update({
        where: { id: customerId },
        data: { qb_id: Id, qb_sync_token: SyncToken },
      });

      // 5. Mark log success
      await this.prisma.syncLog.update({
        where: { id: log.id },
        data: {
          status: 'success',
          qb_id: Id,
          attempts: job.attemptsMade,
        },
      });
    } catch (error) {
      // 6. Mark log failed
      await this.prisma.syncLog.update({
        where: { id: log.id },
        data: {
          status: 'failed',
          error: error.message,
          attempts: job.attemptsMade,
        },
      });

      this.logger.error(
        `❌ Sync failed for customer ${customerId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }
}
