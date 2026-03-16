import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from '../pagination/dto/pagination.dto.js';
import { buildProductOrderBy } from '../product/product.sort.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';
import { PaymentMapper } from './mappers/payment-mapper.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCreatedEvent } from './events/payment-created.event.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';
import { PaymentUpdatedEvent } from './events/payment-updated.event.js';

@Injectable()
export class PaymentService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(pagination: PaginationDto): Promise<{
    data: PaymentResponseDto[];
    hasNextPage: boolean;
    nextCursor: {
      created_at: Date;
      id: string;
    } | null;
  }> {
    const {
      cursor,
      limit = 20,
      sortBy = 'created_at',
      order = 'asc',
    } = pagination;
    const orderBy = buildProductOrderBy(sortBy, order);

    const payments = await this.prismaService.payment.findMany({
      take: limit + 1,
      cursor: cursor
        ? {
            created_at_id: {
              created_at: cursor.created_at,
              id: cursor.id,
            },
          }
        : undefined,
      skip: cursor ? 1 : 0,
      orderBy: orderBy,
    });

    let hasNextPage = false;
    let nextCursor: {
      created_at: Date;
      id: string;
    } | null = null;

    if (payments.length > limit) {
      hasNextPage = true;

      const nextItem = payments.pop(); // remove extra record
      nextCursor = nextItem
        ? {
            created_at: nextItem?.created_at,
            id: nextItem?.id,
          }
        : null;
    }

    return {
      data: payments.map(PaymentMapper.toResponseDto),
      hasNextPage: hasNextPage,
      nextCursor,
    };
  }

  async findOne(id: string): Promise<PaymentResponseDto> {
    const payment = await this.prismaService.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return PaymentMapper.toResponseDto(payment);
  }
  async create(data: CreatePaymentDto): Promise<PaymentResponseDto> {
    if (data.payment_type === 'INVOICE') {
      // verify invoice exists and belongs to customer
      const invoice = await this.prismaService.invoice.findUniqueOrThrow({
        where: { id: data.invoice_id },
      });

      if (invoice.customer_id !== data.customer_id) {
        throw new BadRequestException(
          'Invoice does not belong to this customer',
        );
      }

      if (invoice.status === 'PAID') {
        throw new BadRequestException('Invoice is already paid');
      }

      if (data.amount > invoice.total_amount.toNumber()) {
        throw new BadRequestException('Payment exceeds invoice total');
      }
    }
    const payment = await this.prismaService.payment.create({
      data,
    });

    this.eventEmitter.emit(
      'payment.created',
      new PaymentCreatedEvent(payment.id),
    );

    return PaymentMapper.toResponseDto(payment);
  }
  async update(
    id: string,
    data: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prismaService.payment.update({
      where: { id },
      data,
    });

    this.eventEmitter.emit(
      'payment.created',
      new PaymentCreatedEvent(payment.id),
    );

    return PaymentMapper.toResponseDto(payment);
  }

  async delete(id: string): Promise<PaymentResponseDto> {
    const payment = await this.prismaService.payment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
    console.log('deletedddd', payment);

    this.eventEmitter.emit(
      'payment.deleted',
      new PaymentUpdatedEvent(payment.id),
    );

    return PaymentMapper.toResponseDto(payment);
  }
}
