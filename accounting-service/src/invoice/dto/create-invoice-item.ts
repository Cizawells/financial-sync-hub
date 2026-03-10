// invoice/dto/create-invoice-item.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
  @IsOptional()
  @IsString()
  invoice_id: string;

  @IsString()
  product_id: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  unit_price: number;

  @Type(() => Number)
  @IsNumber()
  line_total: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tax_rate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount_percent?: number;
}
