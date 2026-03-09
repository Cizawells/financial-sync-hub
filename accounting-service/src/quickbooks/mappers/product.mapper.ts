import { Product } from '../../generated/prisma/client.js';

// quickbooks/mappers/product.mapper.ts
export class QBProductMapper {
  static toQuickBooks(product: Product) {
    if (product.qb_id) {
      return {
        Name: `${product.name}`,
        IncomeAccountRef: {
          name: 'Sales of Product Income',
          value: '79',
        },
        QtyOnHand: product.quantity_on_hand,
        UnitPrice: product.unit_price || undefined,
        TrackQtyOnHand: product.type === 'Inventory' ? true : false,
        InvStartDate: product.inventory_start_date
          ? product.inventory_start_date
          : undefined,
        ReorderPoint: product.reorder_point ? product.reorder_point : undefined,
        Taxable: product.taxable ? product.taxable : undefined,
        Active: product.active ? product.active : undefined,
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
        Name: `${product.name}`,
        IncomeAccountRef: {
          name: 'Sales of Product Income',
          value: '79',
        },
        TrackQtyOnHand: product.type === 'Inventory' ? true : false,
        UnitPrice: product.unit_price || undefined,
        QtyOnHand: product.quantity_on_hand,
        InvStartDate: product.inventory_start_date
          ? product.inventory_start_date
          : undefined,
        ReorderPoint: product.reorder_point ? product.reorder_point : undefined,
        Taxable: product.taxable ? product.taxable : undefined,
        Active: product.active ? product.active : undefined,
        AssetAccountRef: {
          name: 'Inventory Asset',
          value: '81',
        },
        Type: product.type ? product.type : 'Invetory',
        ExpenseAccountRef: {
          name: 'Cost of Goods Sold',
          value: '80',
        },
        // InvStartDate: product.
      };
    }
  }
}
