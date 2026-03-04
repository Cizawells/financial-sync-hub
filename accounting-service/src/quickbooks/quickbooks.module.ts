import { Module } from '@nestjs/common';
import { QuickBooksAuthService } from './quickbooks-auth.service.js';
import { QuickBooksService } from './quickbooks.service.js';
import { QuickBooksController } from './quickbooks.controller.js';

@Module({
  controllers: [QuickBooksController],
  providers: [QuickBooksAuthService, QuickBooksService],
  exports: [QuickBooksService],
})
export class QuickbooksModule {}
