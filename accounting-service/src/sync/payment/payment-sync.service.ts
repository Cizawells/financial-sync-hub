import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProductCreatedEvent } from '../../product/events/product-created.event.js';
import { ProductDeletedEvent } from '../../product/events/product-deleted.event.js';
import { ProductUpdatedEvent } from '../../product/events/product-updated.event.js';
import { PaymentCreatedEvent } from '../../payment/events/payment-created.event.js';

// sync/sync.service.ts
@Injectable()
export class PaymentSyncService {
  constructor(@InjectQueue('payment-sync') private syncQueue: Queue) {}
  @OnEvent('payment.created')
  async handlePaymentCreated(event: PaymentCreatedEvent) {
    console.log('Syncing payment:', event.paymentId);
    await this.syncQueue.add(
      'create',
      { paymentId: event.paymentId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('payment.updated')
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
  @OnEvent('payment.deleted')
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
  @OnEvent('payment.reactivated')
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
