// customers/events/customer-created.event.ts
export class ProductUpdatedEvent {
  constructor(public readonly customerId: string) {}
}
