import { IsDateString, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

// dto/user-response.dto.ts
export class CreateCustomerDto {
  
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  currency: string

  @IsString()
  @IsOptional()
  payment_terms?: string

  @IsOptional()
  @IsString()
  qb_customer_id?: string

  @IsOptional()
  @IsString()
  billing_address?: string

  @IsString()
  @IsOptional()
  shipping_address?: string

  @IsOptional()
  @IsString()
  tax_exempt?: string

  @IsOptional()
  @IsNumber()
  balance?: number

  @IsOptional()
  @IsDateString()
  create_at?: Date

  @IsOptional()
  @IsDateString()
  updated_at?: Date

}
