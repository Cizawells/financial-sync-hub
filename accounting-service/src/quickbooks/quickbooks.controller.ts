// quickbooks/quickbooks.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import { QuickBooksAuthService } from './quickbooks-auth.service.js';

@Controller('quickbooks')
export class QuickBooksController {
  constructor(private authService: QuickBooksAuthService) {}

  @Get('connect')
  connect(@Res() res) {
    const authUrl = this.authService.getAuthUrl();
    return res.redirect(authUrl); // sends you to Intuit login page
  }

  @Get('callback')
  async callback(@Req() req, @Res() res) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const tokens = await this.authService.handleCallback(fullUrl);

    // Tokens will print in your terminal console
    return res.json(tokens); // also visible in browser
  }
}
