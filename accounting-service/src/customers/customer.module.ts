import { Module } from '@nestjs/common';
import { CustomersController } from './customer.controller.js';
import { CustomerService } from './customer.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
    controllers: [CustomersController],
    providers: [CustomerService, PrismaService]
})
export class CustomersModule {
    
}
