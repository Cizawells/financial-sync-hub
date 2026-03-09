/*
  Warnings:

  - You are about to alter the column `unity_price` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `line_total` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `discount_amount` on the `invoice_items` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `total_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `subtotal` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `tax_amount` on the `invoices` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "invoice_items" ALTER COLUMN "unity_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "line_total" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discount_amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "total_amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "tax_amount" DROP NOT NULL,
ALTER COLUMN "tax_amount" SET DATA TYPE DECIMAL(10,2);
