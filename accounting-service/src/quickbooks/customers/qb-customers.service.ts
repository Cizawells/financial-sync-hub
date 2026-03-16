import { Injectable } from '@nestjs/common';
import { Customer } from '../../generated/prisma/client.js';
import { QBCustomerMapper } from '../mappers/customer.mapper.js';
import { QuickBooksService } from '../quickbooks.service.js';
import { QuickBooksAuthService } from '../quickbooks-auth.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QBCustomerService {
  constructor(
    private client: QuickBooksService,
    private authService: QuickBooksAuthService,
    private config: ConfigService,
  ) {}

  async createCustomer(customer: Customer): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const accessToken = await this.authService.getValidAccessToken();
    const realmId = this.config.get<string>('QB_REALM_ID');
    const baseUrl = this.config.get<string>('QB_BASE_URL');

    const payload = QBCustomerMapper.toQuickBooks(customer);
    console.log('payloadd customer', payload);
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/customer?minorversion=75`,
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
      const error = (await response.json()) as {
        message: string;
      };
      throw new Error(
        `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = (await response.json()) as {
      Customer: { Id: string; SyncToken: string };
    };
    return {
      Id: data.Customer.Id,
      SyncToken: data.Customer.SyncToken,
    };
  }
  async updateCustomer(customer: Customer): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const accessToken = await this.authService.getValidAccessToken();
    const realmId = this.config.get<string>('QB_REALM_ID');
    const baseUrl = this.config.get<string>('QB_BASE_URL');

    const payload = QBCustomerMapper.toQuickBooks(customer);
    console.log('payloaddd', payload);
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/customer?minorversion=75`,
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
      const error = (await response.json()) as {
        message: string;
      };
      throw new Error(
        `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = (await response.json()) as {
      Customer: { Id: string; SyncToken: string };
    };
    return {
      Id: data.Customer.Id,
      SyncToken: data.Customer.SyncToken,
    };
  }
  async deleteCustomer(customer: Customer): Promise<{
    Id: string;
    SyncToken: string;
  }> {
    const accessToken = await this.authService.getValidAccessToken();
    const realmId = this.config.get<string>('QB_REALM_ID');
    const baseUrl = this.config.get<string>('QB_BASE_URL');

    const payload = QBCustomerMapper.toQuickBooks(customer);
    console.log('delete payloaddd', payload);
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/customer?minorversion=75`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Id: payload.Id,
          SyncToken: payload.SyncToken,
          Active: false,
          sparse: true,
        }),
      },
    );

    if (!response.ok) {
      const error = (await response.json()) as {
        message: string;
      };
      throw new Error(
        `QuickBooks API error: ${response.status} - ${JSON.stringify(error)}`,
      );
    }

    const data = (await response.json()) as {
      Customer: { Id: string; SyncToken: string };
    };
    return {
      Id: data.Customer.Id,
      SyncToken: data.Customer.SyncToken,
    };
  }
}
