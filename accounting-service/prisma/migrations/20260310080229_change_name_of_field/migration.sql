/*
  Warnings:

  - You are about to drop the column `unity_price` on the `invoice_items` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "unity_price",
ADD COLUMN     "unit_price" DECIMAL(10,2) NOT NULL;
