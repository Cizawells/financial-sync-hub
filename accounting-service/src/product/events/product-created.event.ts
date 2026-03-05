// customers/events/customer-created.event.ts
export class ProductCreatedEvent {
  constructor(public readonly productId: string) {}
}
