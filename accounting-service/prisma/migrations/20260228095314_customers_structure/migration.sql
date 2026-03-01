-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "currency" TEXT,
    "payment_terms" TEXT,
    "qb_customer_id" TEXT,
    "billing_address" TEXT,
    "shipping_address" TEXT,
    "tax_exempt" TEXT,
    "balance" DECIMAL(10,2),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
