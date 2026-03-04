import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service.js';
import type { Request } from 'express';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { PaginationDto } from '../pagination/dto/pagination.dto.js';

@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomerService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.customerService.findAll(pagination);
  }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }
}
