// customers/events/customer-created.event.ts
export class CustomerDeletedEvent {
  constructor(public readonly customerId: string) {}
}
