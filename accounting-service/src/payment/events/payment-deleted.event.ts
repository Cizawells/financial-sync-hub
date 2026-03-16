// customers/events/customer-created.event.ts
export class PaymentDeletedEvent {
  constructor(public readonly paymentId: string) {}
}
