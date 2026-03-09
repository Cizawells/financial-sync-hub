// customers/events/customer-created.event.ts
export class InvoiceCreatedEvent {
  constructor(public readonly invoiceId: string) {}
}
