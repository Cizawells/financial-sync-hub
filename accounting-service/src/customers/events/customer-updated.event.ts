// customers/events/customer-created.event.ts
export class CustomerUpdatedEvent {
  constructor(public readonly customerId: string) {}
}
