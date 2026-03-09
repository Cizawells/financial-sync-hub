import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { InvoiceService } from './invoice.service.js';

@Module({
  controllers: [InvoiceController],
  providers: [PrismaService, InvoiceService],
})
export class InvoiceModule {}
