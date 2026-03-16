import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsUUID,
  IsEnum,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '../../generated/prisma/enums.js';

export class CreatePaymentDto {
  @IsEnum(PaymentType)
  payment_type: PaymentType;

  @IsUUID()
  customer_id: string;

  // only required when payment_type is INVOICE
  @ValidateIf((o: CreatePaymentDto) => o.payment_type === PaymentType.INVOICE)
  @IsUUID()
  invoice_id?: string;

  @IsOptional()
  @IsUUID()
  payment_method_id?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @Type(() => Date)
  @IsDate()
  payment_date: Date;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
