/*
  Warnings:

  - Made the column `sync_status` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sync_status` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "customers"
SET "sync_status" = 'NOTSYNCED'
WHERE "sync_status" IS NULL;

UPDATE "invoices"
SET "sync_status" = 'NOTSYNCED'
WHERE "sync_status" IS NULL;

-- UPDATE "products"
-- SET "sync_status" = 'NOTSYNCED'
-- WHERE "sync_status" IS NULL;

ALTER TABLE "customers" ALTER COLUMN "sync_status" SET NOT NULL,
ALTER COLUMN "sync_status" SET DEFAULT 'NOTSYNCED';

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "sync_status" SET NOT NULL,
ALTER COLUMN "sync_status" SET DEFAULT 'NOTSYNCED';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "sync_status" "SYNCSTATUS" NOT NULL DEFAULT 'NOTSYNCED';
