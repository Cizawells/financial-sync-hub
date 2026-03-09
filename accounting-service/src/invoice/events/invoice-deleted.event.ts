// customers/events/customer-created.event.ts
export class InvoiceDeletedEvent {
  constructor(public readonly invoiceId: string) {}
}
