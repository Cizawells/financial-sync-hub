// customers/events/customer-created.event.ts
export class ProductDeletedEvent {
  constructor(public readonly customerId: string) {}
}
