// quickbooks/quickbooks.service.ts
import { Injectable } from '@nestjs/common';
import { createRequire } from 'module';
import { ConfigService } from '@nestjs/config';

const require = createRequire(import.meta.url);
const QuickBooks = require('node-quickbooks');

@Injectable()
export class QuickBooksService {
  constructor(private config: ConfigService) {}

  getQBClient() {
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
}
