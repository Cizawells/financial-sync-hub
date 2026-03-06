import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

// dto/user-response.dto.ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsString()
  type: 'Inventory' | 'NonInventory' | 'Service';

  @Type(() => Number)
  @IsNumber()
  unit_price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost?: number;

  @Type(() => Number)
  @IsNumber()
  quantity_on_hand?: number;

  @ValidateIf((o: CreateProductDto) => o.type === 'Inventory')
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  inventory_start_date?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  reorder_point?: number;

  @IsOptional()
  @IsBoolean()
  taxable?: boolean;

  @IsOptional()
  @IsString()
  qb_id?: string;

  @IsOptional()
  @IsString()
  qb_sync_token?: string;

  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsDate()
  deleted_at?: Date;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
