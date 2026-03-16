import { Injectable } from '@nestjs/common';
import { QuickBooksService } from '../quickbooks.service.js';
import { ConfigService } from '@nestjs/config';
import {
  Customer,
  Invoice,
  InvoiceItem,
  Payment,
  PaymentMethod,
  Prisma,
  Product,
} from '../../generated/prisma/client.js';
import { QBInvoiceMapper } from '../mappers/invoice.mapper.js';
import { QuickBooksAuthService } from '../quickbooks-auth.service.js';
import { QBPaymentMapper } from '../mappers/payment.mapper.js';

type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: {
    payment_method: true;
    customer: true;
  };
}>;

@Injectable()
export class QBPaymentService {
  constructor(
    private client: QuickBooksService,
    private config: ConfigService,
    private authService: QuickBooksAuthService,
  ) {}

  async createPayment(payment: PaymentWithRelations): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const accessToken = await this.authService.getValidAccessToken();
    const realmId = this.config.get<string>('QB_REALM_ID');
    // const isSandbox = this.config.get('QB_ENVIRONMENT') === 'sandbox';
    const baseUrl = this.config.get<string>('QB_BASE_URL');
    const payload = QBPaymentMapper.toQuickBooks(payment);
    console.log('payload invoiceeeeeeeeeee', payload);
    // console.dir(payload, { depth: null });
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/payment?minorversion=75`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.log('faillllleddd', JSON.stringify(error));
      throw new Error(
        `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = (await response.json()) as {
      Payment: { Id: string; SyncToken: string };
    };
    return {
      Id: data.Payment.Id,
      SyncToken: data.Payment.SyncToken,
    };
  }
  // async updateProduct(product: Product): Promise<{
  //   Id: string;
  //   SyncToken: string;
  // }> {
  //   const accessToken = this.config.get<string>('QB_ACCESS_TOKEN');
  //   const realmId = this.config.get<string>('QB_REALM_ID');
  //   // const isSandbox = this.config.get('QB_ENVIRONMENT') === 'sandbox';
  //   const baseUrl = this.config.get<string>('QB_BASE_URL');

  //   const payload = QBProductMapper.toQuickBooks(product);
  //   const response = await fetch(
  //     `${baseUrl}/v3/company/${realmId}/item?minorversion=75`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     },
  //   );

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(
  //       `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
  //     );
  //   }

  //   const data = (await response.json()) as {
  //     Item: { Id: string; SyncToken: string };
  //   };
  //   return {
  //     Id: data.Item.Id,
  //     SyncToken: data.Item.SyncToken,
  //   };
  // }
  // async reactivateProduct(product: Product): Promise<{
  //   Id: string;
  //   SyncToken: string;
  // }> {
  //   const accessToken = this.config.get<string>('QB_ACCESS_TOKEN');
  //   const realmId = this.config.get<string>('QB_REALM_ID');
  //   // const isSandbox = this.config.get('QB_ENVIRONMENT') === 'sandbox';
  //   const baseUrl = this.config.get<string>('QB_BASE_URL');

  //   const payload = QBProductMapper.toQuickBooks(product);
  //   const response = await fetch(
  //     `${baseUrl}/v3/company/${realmId}/item?minorversion=75`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify({
  //         Name: payload.Name,
  //         ExpenseAccountRef: payload.ExpenseAccountRef,
  //         Active: true,
  //         Type: payload.Type,
  //         QtyOnHand: payload.QtyOnHand,
  //         TrackQtyOnHand: payload.TrackQtyOnHand,
  //         InvStartDate: payload.InvStartDate,
  //         AssetAccountRef: payload.AssetAccountRef,
  //         IncomeAccountRef: payload.IncomeAccountRef,
  //       }),
  //     },
  //   );

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(
  //       `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
  //     );
  //   }

  //   const data = (await response.json()) as {
  //     Item: { Id: string; SyncToken: string };
  //   };
  //   return {
  //     Id: data.Item.Id,
  //     SyncToken: data.Item.SyncToken,
  //   };
  // }
  // async deleteProduct(product: Product): Promise<{
  //   Id: string;
  //   SyncToken: string;
  // }> {
  //   const accessToken = this.config.get<string>('QB_ACCESS_TOKEN');
  //   const realmId = this.config.get<string>('QB_REALM_ID');
  //   // const isSandbox = this.config.get('QB_ENVIRONMENT') === 'sandbox';
  //   const baseUrl = this.config.get<string>('QB_BASE_URL');

  //   const payload = QBProductMapper.toQuickBooks(product);
  //   const response = await fetch(
  //     `${baseUrl}/v3/company/${realmId}/item?minorversion=75`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json',
  //       },
  //       body: JSON.stringify({ ...payload, Active: false }),
  //     },
  //   );

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(
  //       `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
  //     );
  //   }

  //   const data = (await response.json()) as {
  //     Item: { Id: string; SyncToken: string };
  //   };
  //   return {
  //     Id: data.Item.Id,
  //     SyncToken: data.Item.SyncToken,
  //   };
  // }
}
