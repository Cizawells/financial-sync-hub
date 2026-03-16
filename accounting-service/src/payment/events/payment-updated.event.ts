// customers/events/customer-created.event.ts
export class PaymentUpdatedEvent {
  constructor(public readonly paymentId: string) {}
}
