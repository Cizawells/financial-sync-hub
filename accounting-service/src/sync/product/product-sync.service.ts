import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProductCreatedEvent } from '../../product/events/product-created.event.js';
import { ProductDeletedEvent } from '../../product/events/product-deleted.event.js';
import { ProductUpdatedEvent } from '../../product/events/product-updated.event.js';

// sync/sync.service.ts
@Injectable()
export class productSyncService {
  constructor(@InjectQueue('product-sync') private syncQueue: Queue) {}
  @OnEvent('product.created')
  async handleProductCreated(event: ProductCreatedEvent) {
    console.log('Syncing product:', event.productId);
    await this.syncQueue.add(
      'create',
      { productId: event.productId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('product.updated')
  async handleProductUpdated(event: ProductCreatedEvent) {
    console.log('Syncing product:', event.productId);
    await this.syncQueue.add(
      'update',
      { productId: event.productId, action: 'update' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('product.deleted')
  async handleProductDeleted(event: ProductDeletedEvent) {
    console.log('Syncing delete product:', event.productId);
    await this.syncQueue.add(
      'delete',
      { productId: event.productId, action: 'delete' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('product.reactivated')
  async handleProductReactivate(event: ProductUpdatedEvent) {
    await this.syncQueue.add(
      'reactivate',
      { productId: event.productId, action: 'reactivate' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
}
