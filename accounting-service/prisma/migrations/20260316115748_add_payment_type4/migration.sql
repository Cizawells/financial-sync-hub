-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('INVOICE', 'CUSTOMER');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "payment_type" "PaymentType" NOT NULL DEFAULT 'INVOICE';
