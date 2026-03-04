// quickbooks/quickbooks-auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OAuthClient from 'intuit-oauth';

@Injectable()
export class QuickBooksAuthService {
  private oauthClient: OAuthClient;

  constructor(private config: ConfigService) {
    this.oauthClient = new OAuthClient({
      clientId: this.config.get('QB_CLIENT_ID'),
      clientSecret: this.config.get('QB_CLIENT_SECRET'),
      environment: this.config.get('QB_ENVIRONMENT'), // 'sandbox' or 'production'
      redirectUri: this.config.get('QB_REDIRECT_URI'),
    });
  }

  // Call this once manually to get your first tokens
  getAuthUrl(): string {
    return this.oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'init',
    });
  }

  // QB redirects here after user approves
  async handleCallback(url: string) {
    const token = await this.oauthClient.createToken(url);
    // Save these tokens to DB or .env for reuse
    console.log('Access Token:', token.getJson().access_token);
    console.log('Refresh Token:', token.getJson().refresh_token);
    return token.getJson();
  }

  async getValidClient() {
    this.oauthClient.setToken({
      access_token: this.config.get('QB_ACCESS_TOKEN'),
      refresh_token: this.config.get('QB_REFRESH_TOKEN'),
    });

    // Auto refresh if expired
    if (this.oauthClient.isAccessTokenValid() === false) {
      const token = await this.oauthClient.refresh();
      // ideally persist the new token to DB here
    }

    return this.oauthClient;
  }
}
