import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductResponseDto } from './dto/product-response.dto.js';
import { PaginationDto } from 'src/pagination/dto/pagination.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { buildProductOrderBy } from './product.sort.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductUpdatedEvent } from './events/product-updated.event.js';
import { ProductDeletedEvent } from './events/product-deleted.event.js';
import { ProductMapper } from './mappers/product-mapper.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductCreatedEvent } from './events/product-created.event.js';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(pagination: PaginationDto): Promise<{
    data: ProductResponseDto[];
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

    const products = await this.prismaService.product.findMany({
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

    if (products.length > limit) {
      hasNextPage = true;

      const nextItem = products.pop(); // remove extra record
      nextCursor = nextItem
        ? {
            created_at: nextItem?.created_at,
            id: nextItem?.id,
          }
        : null;
    }

    return {
      data: products.map(ProductMapper.toResponseDto),
      hasNextPage: hasNextPage,
      nextCursor,
    };
  }

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    // const products = cutsomersgzxyxsx3
    const product = await this.prismaService.product.create({
      data,
    });

    this.eventEmitter.emit(
      'product.created',
      new ProductCreatedEvent(product.id),
    );

    return ProductMapper.toResponseDto(product);
  }
  async update(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    console.log('iddddd', id);
    const product = await this.prismaService.product.update({
      where: { id },
      data,
    });

    console.log('producttttttttttt', product);

    this.eventEmitter.emit(
      'product.updated',
      new ProductUpdatedEvent(product.id),
    );

    return ProductMapper.toResponseDto(product);
  }
  async delete(id: string): Promise<ProductResponseDto> {
    const product = await this.prismaService.product.update({
      where: { id },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });

    this.eventEmitter.emit(
      'product.deleted',
      new ProductDeletedEvent(product.id),
    );

    return ProductMapper.toResponseDto(product);
  }
}
