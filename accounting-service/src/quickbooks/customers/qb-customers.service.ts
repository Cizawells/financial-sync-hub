import { Injectable } from '@nestjs/common';
import { Customer } from '../../generated/prisma/client.js';
import { QBCustomerMapper } from '../mappers/customer.mapper.js';
import { QuickBooksService } from '../quickbooks.service.js';

@Injectable()
export class QBCustomerService {
  constructor(private client: QuickBooksService) {}

  async createCustomer(customer: any): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const payload = QBCustomerMapper.toQuickBooks(customer);
    return new Promise((resolve, reject) => {
      let qb = this.client.getQBClient();
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
