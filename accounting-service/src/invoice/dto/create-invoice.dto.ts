// invoice/dto/create-invoice.dto.ts
import {
  IsString,
  IsDate,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.js';
import { InvoiceStatus, SYNCSTATUS } from '../../generated/prisma/enums.js';

export class CreateInvoiceDto {
  @IsString()
  customer_id: string;

  @Type(() => Date)
  @IsDate()
  invoice_date: Date;

  @Type(() => Date)
  @IsDate()
  due_date: Date;

  @IsOptional()
  @IsEnum(SYNCSTATUS)
  sync_status?: SYNCSTATUS;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsString()
  qb_id: string;

  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  tax_amount: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;

  // nested line items
  @IsArray()
  @ArrayMinSize(1) // at least one line item
  @ValidateNested({ each: true }) // validate each item in array
  @Type(() => CreateInvoiceItemDto) // transform each item
  invoice_items: CreateInvoiceItemDto[];
}
