// quickbooks/quickbooks-auth.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OAuthClient from 'intuit-oauth';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class QuickBooksAuthService {
  private oauthClient: OAuthClient;

  constructor(
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {
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
    const tokens = token.getJson() as {
      access_token: string;
      refresh_token: string;
    };

    // ✅ save to DB immediately
    await this.saveToken(tokens.access_token, tokens.refresh_token);

    return tokens;
  }

  async saveToken(accessToken: string, refreshToken: string) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    let token = await this.prismaService.qbToken.upsert({
      where: { id: 1 },
      update: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
      create: {
        id: 1,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
    });

    return token;
  }

  async getValidAccessToken(): Promise<string> {
    const tokenRecord = await this.prismaService.qbToken.findUnique({
      where: { id: 1 },
    });

    if (!tokenRecord) {
      throw new Error('No QB tokens found. Please authenticate first.');
    }

    // check if token is still valid (with 5 min buffer)
    const isExpired =
      new Date() >= new Date(tokenRecord.expires_at.getTime() - 5 * 60 * 1000);
    if (!isExpired) {
      return tokenRecord.access_token; // still valid, return as is
    }

    // token expired — refresh it
    return this.refreshAccessToken(tokenRecord.refresh_token);
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      this.oauthClient.setToken({ refresh_token: refreshToken });
      const authResponse = await this.oauthClient.refresh();
      const newTokens = authResponse.getJson() as {
        access_token: string;
        refresh_token: string;
      };

      await this.saveToken(newTokens.access_token, newTokens.refresh_token);
      return newTokens.access_token;
    } catch (error) {
      // refresh token is dead — user must reauthorize
      throw new Error(
        'QuickBooks session expired. Please reauthorize at /quickbooks/connect',
      );
    }
  }
}
