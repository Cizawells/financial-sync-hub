import { Product } from '../../generated/prisma/client.js';

// quickbooks/mappers/product.mapper.ts
export class QBProductMapper {
  static toQuickBooks(product: Product) {
    if (product.qb_id) {
      return {
        name: `${product.name}`,
        quantityOnHand: product.quantity_on_hand,
        IncomeAccountRef: {
          name: 'Sales of Product Income',
          value: '79',
        },
        QtyOnHand: product.quantity_on_hand,
        AssetAccountRef: {
          name: 'Inventory Asset',
          value: '81',
        },
        Type: product.type ? product.type : 'Inventory',
        ExpenseAccountRef: {
          name: 'Cost of Goods Sold',
          value: '80',
        },
        Id: product.qb_id,
        SyncToken: product.qb_sync_token ? product.qb_sync_token : undefined,
      };
    } else {
      return {
        name: `${product.name}`,
        quantityOnHand: product.quantity_on_hand,
        IncomeAccountRef: {
          name: 'Sales of Product Income',
          value: '79',
        },
        QtyOnHand: product.quantity_on_hand,
        AssetAccountRef: {
          name: 'Inventory Asset',
          value: '81',
        },
        Type: product.type ? product.type : 'Invetory',
        ExpenseAccountRef: {
          name: 'Cost of Goods Sold',
          value: '80',
        },
      };
    }
  }
}
