// customers/events/customer-created.event.ts
export class CustomerCreatedEvent {
  constructor(public readonly customerId: string) {}
}
