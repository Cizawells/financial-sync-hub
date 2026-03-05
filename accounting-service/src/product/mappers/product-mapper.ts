import { Product } from 'src/generated/prisma/client.js';
import { ProductResponseDto } from '../dto/product-response.dto.js';

export class ProductMapper {
  static toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      quantity_on_hand: product.quantity_on_hand,
      active: product.active,
    };
  }
}
