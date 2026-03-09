// sync/sync.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QBProductService } from '../../quickbooks/product/qb-product.service.js';

@Processor('product-sync')
export class ProductSyncProcessor extends WorkerHost {
  private readonly logger = new Logger(ProductSyncProcessor.name);

  constructor(
    private prisma: PrismaService,
    private qbProductService: QBProductService,
  ) {
    super();
  }

  async process(job: Job<{ productId: string; action: string }>) {
    switch (job.name) {
      case 'create':
        return this.handleCreate(job);
      case 'update':
        return this.handleUpdate(job);
      case 'reactivate':
        return this.handleReactivate(job);
      case 'delete':
        return this.handleDelete(job);
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  private async handleCreate(job: Job<{ productId: string }>) {
    const { productId } = job.data;

    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'product',
        entity_id: productId,
        action: 'create',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch product
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } =
        await this.qbProductService.createProduct(product);
      console.log('yeeeesssss', { Id, SyncToken });
      // 4. Save QB id back to product record
      await this.prisma.product.update({
        where: { id: productId },
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
        `❌ Sync failed for product ${productId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }

  //update
  private async handleUpdate(job: Job<{ productId: string }>) {
    const { productId } = job.data;

    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'product',
        entity_id: productId,
        action: 'update',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch product
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } =
        await this.qbProductService.updateProduct(product);

      // 4. Save QB synctoken back to product record
      await this.prisma.product.update({
        where: { id: productId },
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
        `❌ Sync failed for product ${productId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }
  //reactivate
  private async handleReactivate(job: Job<{ productId: string }>) {
    const { productId } = job.data;

    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'product',
        entity_id: productId,
        action: 'reactivate',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch product
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } =
        await this.qbProductService.reactivateProduct(product);
      console.log('success');
      // 4. Save QB synctoken back to product record
      await this.prisma.product.update({
        where: { id: productId },
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
        `❌ Sync failed for product ${productId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }

  //Delete;
  private async handleDelete(job: Job<{ productId: string }>) {
    const { productId } = job.data;
    // 1. Create sync log
    const log = await this.prisma.syncLog.create({
      data: {
        entity_type: 'product',
        entity_id: productId,
        action: 'delete',
        status: 'pending',
      },
    });

    try {
      // 2. Fetch product
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
      });

      // 3. Push to QuickBooks
      const { Id, SyncToken } =
        await this.qbProductService.deleteProduct(product);

      // 4. Save QB synctoken back to product record
      await this.prisma.product.update({
        where: { id: productId },
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
        `❌ Sync failed for product ${productId}: ${error.message}`,
      );
      throw error; // rethrow → BullMQ triggers retry
    }
  }
}
