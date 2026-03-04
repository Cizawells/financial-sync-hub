import { Customer } from '../../generated/prisma/client.js';

// quickbooks/mappers/customer.mapper.ts
export class QBCustomerMapper {
  static toQuickBooks(customer: Customer) {
    if (customer.qb_id) {
      return {
        DisplayName: `${customer.first_name} ${customer.last_name}`,
        PrimaryEmailAddr: customer.email
          ? { Address: customer.email }
          : undefined,
        PrimaryPhone: customer.phone
          ? { FreeFormNumber: customer.phone }
          : undefined,
        BillAddr: {
          Line1: customer.address,
          City: customer.city,
          Country: customer.country,
        },
        Id: customer.qb_id,
        SyncToken: customer.qb_sync_token ? customer.qb_sync_token : undefined,
      };
    } else {
      return {
        DisplayName: `${customer.first_name} ${customer.last_name}`,
        PrimaryEmailAddr: customer.email
          ? { Address: customer.email }
          : undefined,
        PrimaryPhone: customer.phone
          ? { FreeFormNumber: customer.phone }
          : undefined,
        BillAddr: {
          Line1: customer.address,
          City: customer.city,
          Country: customer.country,
        },
      };
    }
  }
}
