// customers/events/customer-created.event.ts
export class InvoiceUpdatedEvent {
  constructor(public readonly invoiceId: string) {}
}
