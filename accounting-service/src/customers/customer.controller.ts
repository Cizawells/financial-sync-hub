import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from "@nestjs/common";
import { CustomerService } from "./customer.service.js";
import type { Request } from "express";
import { CreateCustomerDto } from "./dto/create-customer.dto.js";
import { UpdateCustomerDto } from "./dto/update-customer.dto.js";

@Controller('customers')
export class CustomersController {

    constructor(private customerService: CustomerService){}
    
    @Get()
    findAll() {
        return this.customerService.findAll()
    }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customerService.create(createCustomerDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerDto: UpdateCustomerDto){
        return this.customerService.update(id, updateCustomerDto)
    }
    
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number){
        return this.customerService.delete(id)
    }
}