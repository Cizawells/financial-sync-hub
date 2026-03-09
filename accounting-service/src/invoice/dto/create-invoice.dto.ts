// invoice/dto/create-invoice.dto.ts
import {
  IsString,
  IsDate,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.js';

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
  items: CreateInvoiceItemDto[];
}
