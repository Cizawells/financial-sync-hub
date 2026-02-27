import { Customer } from "src/generated/prisma/client.js";
import { CustomerResponseDto } from "../dto/customer-response.dto.js";

export class CustomerMapper {
  static toResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      created_at: customer.created_at,
    };
  }
}