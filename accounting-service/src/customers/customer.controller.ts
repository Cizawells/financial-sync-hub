import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { CustomerService } from "./customer.service.js";
import type { Request } from "express";
import { CreateCustomerDto } from "./dto/create-customer.dto.js";

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
}