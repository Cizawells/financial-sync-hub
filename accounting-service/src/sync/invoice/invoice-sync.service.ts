import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InvoiceCreatedEvent } from '../../invoice/events/invoice-created.event.js';

// sync/sync.service.ts
@Injectable()
export class InvoiceSyncService {
  constructor(@InjectQueue('invoice-sync') private syncQueue: Queue) {}
  @OnEvent('invoice.created')
  async handleInvoiceCreated(event: InvoiceCreatedEvent) {
    console.log('Syncing invoice:', event.invoiceId);
    await this.syncQueue.add(
      'create',
      { invoiceId: event.invoiceId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  // @OnEvent('product.updated')
  // async handleProductUpdated(event: ProductCreatedEvent) {
  //   console.log('Syncing product:', event.productId);
  //   await this.syncQueue.add(
  //     'update',
  //     { productId: event.productId, action: 'update' },
  //     {
  //       attempts: 5,
  //       backoff: { type: 'exponential', delay: 2000 },
  //       removeOnComplete: { count: 100 },
  //       removeOnFail: false,
  //     },
  //   );
  // }
  // @OnEvent('product.deleted')
  // async handleProductDeleted(event: ProductDeletedEvent) {
  //   console.log('Syncing delete product:', event.productId);
  //   await this.syncQueue.add(
  //     'delete',
  //     { productId: event.productId, action: 'delete' },
  //     {
  //       attempts: 5,
  //       backoff: { type: 'exponential', delay: 2000 },
  //       removeOnComplete: { count: 100 },
  //       removeOnFail: false,
  //     },
  //   );
  // }
  // @OnEvent('product.reactivated')
  // async handleProductReactivate(event: ProductUpdatedEvent) {
  //   await this.syncQueue.add(
  //     'reactivate',
  //     { productId: event.productId, action: 'reactivate' },
  //     {
  //       attempts: 5,
  //       backoff: { type: 'exponential', delay: 2000 },
  //       removeOnComplete: { count: 100 },
  //       removeOnFail: false,
  //     },
  //   );
  // }
}
