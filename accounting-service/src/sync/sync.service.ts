import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomerCreatedEvent } from '../customers/events/customer-created.event.js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CustomerUpdatedEvent } from '../customers/events/customer-updated.event.js';
import { CustomerDeletedEvent } from '../customers/events/customer-deleted.event.js';

// sync/sync.service.ts
@Injectable()
export class SyncService {
  constructor(@InjectQueue('customer-sync') private syncQueue: Queue) {}
  @OnEvent('customer.created')
  async handleCustomerCreated(event: CustomerCreatedEvent) {
    console.log('Syncing customer:', event.customerId);
    await this.syncQueue.add(
      'create',
      { customerId: event.customerId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('customer.updated')
  async handleCustomerUpdated(event: CustomerUpdatedEvent) {
    console.log('Syncing customer:', event.customerId);
    await this.syncQueue.add(
      'update',
      { customerId: event.customerId, action: 'create' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
  @OnEvent('customer.deleted')
  async handleCustomerDeleted(event: CustomerDeletedEvent) {
    await this.syncQueue.add(
      'delete',
      { customerId: event.customerId, action: 'delete' },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 100 },
        removeOnFail: false,
      },
    );
  }
}
