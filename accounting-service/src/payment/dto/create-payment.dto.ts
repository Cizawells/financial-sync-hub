import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsUUID()
  invoice_id: string;

  @IsUUID()
  customer_id: string;

  @IsOptional()
  @IsUUID()
  payment_method_id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01) // payment must be at least 1 cent
  amount: number;

  @Type(() => Date)
  @IsDate()
  payment_date: Date;

  @IsOptional()
  @IsString()
  reference_number?: string; // check number, transaction id, etc

  @IsOptional()
  @IsString()
  notes?: string;
}
