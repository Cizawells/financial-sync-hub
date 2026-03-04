import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  cursor?: {
    created_at: Date;
    id: string;
  }; //  last record

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsString()
  order: 'desc' | 'asc';
}
