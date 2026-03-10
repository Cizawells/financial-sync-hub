import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { InvoiceResponseDto } from './dto/invoice-response.dto.js';
import { InvoiceMapper } from './mappers/invoice-mapper.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerCreatedEvent } from '../customers/events/customer-created.event.js';
import { InvoiceCreatedEvent } from './events/invoice-created.event.js';

@Injectable()
export class InvoiceService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.prismaService.invoice.findMany();
    return invoices.map(InvoiceMapper.toResponseDto);
  }
  async create(data: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    // Destructure to separate nested items from top-level invoice data
    const { invoice_items, ...invoiceData } = data;

    // Map nested items into Prisma’s expected 'create' format
    const invoice = await this.prismaService.invoice.create({
      data: {
        ...invoiceData,
        invoice_items: {
          create: invoice_items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.line_total,
            // add any other fields from CreateInvoiceItemDto if needed
          })),
        },
      },
      include: {
        invoice_items: true,
      },
    });

    this.eventEmitter.emit(
      'invoice.created',
      new InvoiceCreatedEvent(invoice.id),
    );

    // Transform to response DTO
    return InvoiceMapper.toResponseDto(invoice);
  }
  async update(
    id: string,
    data: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    // Destructure to separate nested items from top-level invoice data
    const { invoice_items, ...invoiceData } = data;

    // Map nested items into Prisma’s expected 'create' format
    const invoice = await this.prismaService.invoice.update({
      where: { id },
      data: {
        ...invoiceData, // top-level fields get updated

        // handle nested items if provided
        ...(invoice_items && {
          invoice_items: {
            // Simple approach: delete old items and create new ones
            deleteMany: {}, // deletes all current items for this invoice
            create: invoice_items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              line_total: item.line_total,
            })),
          },
        }),
      },
      include: {
        invoice_items: true,
      },
    });

    // Transform to response DTO
    return InvoiceMapper.toResponseDto(invoice);
  }
  async delete(id: string): Promise<InvoiceResponseDto> {
    // Destructure to separate nested items from top-level invoice data

    // Map nested items into Prisma’s expected 'create' format
    const invoice = await this.prismaService.invoice.update({
      where: { id },
      data: {
        status: 'VOID',
      },
      include: {
        invoice_items: true,
      },
    });

    // Transform to response DTO
    return InvoiceMapper.toResponseDto(invoice);
  }
}
