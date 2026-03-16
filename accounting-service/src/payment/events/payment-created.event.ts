// customers/events/customer-created.event.ts
export class PaymentCreatedEvent {
  constructor(public readonly paymentId: string) {}
}
