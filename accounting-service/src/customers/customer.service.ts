import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CustomerResponseDto } from "./dto/customer-response.dto.js";
import { CustomerMapper } from "./mappers/customer-mapper.js";
import { CreateCustomerDto } from "./dto/create-customer.dto.js";

@Injectable()
export class CustomerService {

    constructor(private prismaService: PrismaService) {}

async findAll(): Promise<CustomerResponseDto[]>{
    // const customers = cutsomersgzxyxsx3
    let customers =  await this.prismaService.customer.findMany()

    return customers.map(CustomerMapper.toResponseDto)
}

async create(data: CreateCustomerDto): Promise<CustomerResponseDto>{
    // const customers = cutsomersgzxyxsx3
    const customer = await this.prismaService.customer.create({
        data
    });

    return  CustomerMapper.toResponseDto(customer)
  

    // return CustomerMapper(customer)
}
}