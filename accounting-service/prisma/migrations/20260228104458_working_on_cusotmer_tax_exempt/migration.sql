/*
  Warnings:

  - The `tax_exempt` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "tax_exempt",
ADD COLUMN     "tax_exempt" BOOLEAN;
