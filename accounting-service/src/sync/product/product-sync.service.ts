import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProductCreatedEvent } from '../../product/events/product-created.event.js';

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
      { productId: event.productId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  //   @OnEvent('product.deleted')
  //   async handleProductDeleted(event: CustomerDeletedEvent) {
  //     await this.syncQueue.add(
  //       'delete',
  //       { customerId: event.customerId, action: 'delete' },
  //       {
  //         attempts: 5,
  //         backoff: { type: 'exponential', delay: 2000 },
  //         removeOnComplete: { count: 100 },
  //         removeOnFail: false,
  //       },
  //     );
  //   }
}
