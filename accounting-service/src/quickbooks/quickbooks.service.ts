// quickbooks/quickbooks.service.ts
import { Injectable } from '@nestjs/common';
import { createRequire } from 'module';
import { ConfigService } from '@nestjs/config';
import { QuickBooksAuthService } from './quickbooks-auth.service.js';
import { QBCustomerMapper } from './mappers/customer.mapper.js';
import { Customer } from '../generated/prisma/client.js';

const require = createRequire(import.meta.url);
const QuickBooks = require('node-quickbooks');

@Injectable()
export class QuickBooksService {
  constructor(
    private config: ConfigService,
    private authService: QuickBooksAuthService,
  ) {}

  private getQBClient() {
    return new QuickBooks(
      this.config.get('QB_CLIENT_ID'),
      this.config.get('QB_CLIENT_SECRET'),
      this.config.get('QB_ACCESS_TOKEN'),
      false, // no token secret (OAuth2)
      this.config.get('QB_REALM_ID'),
      this.config.get('QB_ENVIRONMENT') === 'sandbox',
      false, // debug
      null,
      '2.0',
      this.config.get('QB_REFRESH_TOKEN'),
    );
  }

  async createCustomer(customer: any): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const qb = this.getQBClient();
    const payload = QBCustomerMapper.toQuickBooks(customer);
    console.log('creating payload', payload);
    return new Promise((resolve, reject) => {
      qb.createCustomer(payload, (err, result) => {
        if (err) return reject(err);
        resolve({
          Id: result.Id,
          SyncToken: result.SyncToken,
        }); // QB's ID for this customer
      });
    });
  }
  async updateCustomer(customer: any): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const qb = this.getQBClient();
    const payload = QBCustomerMapper.toQuickBooks(customer);
    console.log('updating payload', payload);
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
}
