/*
  Warnings:

  - A unique constraint covering the columns `[currency]` on the table `Fiat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fiat_currency_key" ON "Fiat"("currency");
