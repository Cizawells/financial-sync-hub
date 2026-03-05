/*
  Warnings:

  - A unique constraint covering the columns `[created_at,id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_created_at_id_key" ON "products"("created_at", "id");
