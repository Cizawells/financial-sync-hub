import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CustomerResponseDto } from './dto/customer-response.dto.js';
import { CustomerMapper } from './mappers/customer-mapper.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { PaginationDto } from 'src/pagination/dto/pagination.dto.js';
import { buildCustomerOrderBy } from './customer.sort.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerCreatedEvent } from './events/customer-created.event.js';
import { CustomerUpdatedEvent } from './events/customer-updated.event.js';
import { CustomerDeletedEvent } from './events/customer-deleted.event.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CustomerService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(pagination: PaginationDto): Promise<{
    data: CustomerResponseDto[];
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
    const orderBy = buildCustomerOrderBy(sortBy, order);

    const customers = await this.prismaService.customer.findMany({
      take: limit + 1, // fetch one extra to d`etect next page
      cursor: cursor
        ? {
            created_at_id: {
              created_at: cursor.created_at,
              id: cursor.id,
            },
          }
        : undefined,
      skip: cursor ? 1 : 0, // skip the cursor itself
      orderBy: orderBy,
    });

    let hasNextPage = false;
    let nextCursor: {
      created_at: Date;
      id: string;
    } | null = null;

    if (customers.length > limit) {
      hasNextPage = true;

      const nextItem = customers.pop(); // remove extra record
      nextCursor = nextItem
        ? {
            created_at: nextItem.created_at!,
            id: nextItem.id,
          }
        : null;
    }

    return {
      data: customers.map(CustomerMapper.toResponseDto),
      hasNextPage: hasNextPage,
      nextCursor,
    };
  }

  async create(data: CreateCustomerDto): Promise<CustomerResponseDto> {
    try {
      const customer = await this.prismaService.customer.create({
        data: {
          ...data,
          created_at: new Date(),
        },
      });

      this.eventEmitter.emit(
        'customer.created',
        new CustomerCreatedEvent(customer.id),
      );

      return CustomerMapper.toResponseDto(customer);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const driverError = (error.meta as any)?.driverAdapterError?.cause;

        if (driverError?.originalCode === '23505') {
          const message: string = driverError.originalMessage;

          if (message.includes('customers_email_key')) {
            throw new ConflictException('Email already exists');
          }

          throw new ConflictException('Unique constraint violation');
        }
      }

      throw error;
    }
  }
  async update(
    id: string,
    data: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    try {
      const customer = await this.prismaService.customer.update({
        where: { id },
        data,
      });

      this.eventEmitter.emit(
        'customer.updated',
        new CustomerUpdatedEvent(customer.id),
      );
      return CustomerMapper.toResponseDto(customer);
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      throw error;
    }
  }
  async delete(id: string): Promise<CustomerResponseDto> {
    const customer = await this.prismaService.customer.update({
      where: { id },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });

    this.eventEmitter.emit(
      'customer.deleted',
      new CustomerDeletedEvent(customer.id),
    );

    return CustomerMapper.toResponseDto(customer);
  }
}
