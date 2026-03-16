/*
  Warnings:

  - A unique constraint covering the columns `[created_at,id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_created_at_id_key" ON "payments"("created_at", "id");
