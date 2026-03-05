import { Injectable } from '@nestjs/common';
import { Customer, Product } from '../../generated/prisma/client.js';
import { QBCustomerMapper } from '../mappers/customer.mapper.js';
import { QuickBooksService } from '../quickbooks.service.js';
import { QBProductMapper } from '../mappers/product.mapper.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QBProductService {
  constructor(
    private client: QuickBooksService,
    private config: ConfigService,
  ) {}

  async createProduct(product: Product): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    console.log('starting synccc', { product });
    const accessToken = this.config.get<string>('QB_ACCESS_TOKEN');
    const realmId = this.config.get<string>('QB_REALM_ID');
    const isSandbox = this.config.get('QB_ENVIRONMENT') === 'sandbox';

    const baseUrl = isSandbox
      ? 'https://sandbox-quickbooks.api.intuit.com'
      : 'https://quickbooks.api.intuit.com';

    const payload = QBProductMapper.toQuickBooks(product);

    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/item?minorversion=75`,
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
      throw new Error(
        `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = (await response.json()) as {
      Item: { Id: string; SyncToken: string };
    };
    return {
      Id: data.Item.Id,
      SyncToken: data.Item.SyncToken,
    };
  }
  async updateCustomer(customer: any): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    let qb = this.client.getQBClient();
    console.log('qbookssss', qb);
    const payload = QBCustomerMapper.toQuickBooks(customer);
    return new Promise((resolve, reject) => {
      qb.updateCustomer(payload, (err, result) => {
        if (err) return reject(err);
        resolve({
          Id: result.Id,
          SyncToken: result.SyncToken,
        }); // QB's ID for this customer
      });
    });
  }
  async deleteCustomer(customer: Customer): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    // if (!customer.qb_sync_token) return;
    let qb = this.client.getQBClient();
    // const payload = QBCustomerMapper.toQuickBooks(customer);
    return new Promise((resolve, reject) => {
      qb.updateCustomer(
        {
          Id: customer.qb_id,
          SyncToken: customer.qb_sync_token,
          Active: false,
        },
        (err, result) => {
          console.log('deleted result', result);
          if (err) return reject(err);
          resolve({
            Id: result.Id,
            SyncToken: result.SyncToken,
          }); // QB's ID for this customer
        },
      );
    });
  }
}
