import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InvoiceService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const invoices = this.prismaService.invoice.findMany();
    return invoices;
  }
}
