/*
  Warnings:

  - The primary key for the `Crypto_wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crypto__wallet_id` on the `Crypto_wallet` table. All the data in the column will be lost.
  - The primary key for the `Fiat_wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fiat__wallet_id` on the `Fiat_wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[symbol]` on the table `Crypto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crypto_wallet_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fiat_wallet_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crypto_wallet" DROP CONSTRAINT "Crypto_wallet_pkey",
DROP COLUMN "crypto__wallet_id",
ADD COLUMN     "crypto_wallet_id" SERIAL NOT NULL,
ADD CONSTRAINT "Crypto_wallet_pkey" PRIMARY KEY ("crypto_wallet_id");

-- AlterTable
ALTER TABLE "Fiat_wallet" DROP CONSTRAINT "Fiat_wallet_pkey",
DROP COLUMN "fiat__wallet_id",
ADD COLUMN     "fiat_wallet_id" SERIAL NOT NULL,
ADD CONSTRAINT "Fiat_wallet_pkey" PRIMARY KEY ("fiat_wallet_id");

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "crypto_wallet_id" INTEGER NOT NULL,
ADD COLUMN     "fiat_wallet_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Crypto_symbol_key" ON "Crypto"("symbol");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_fiat_wallet_id_fkey" FOREIGN KEY ("fiat_wallet_id") REFERENCES "Fiat_wallet"("fiat_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_crypto_wallet_id_fkey" FOREIGN KEY ("crypto_wallet_id") REFERENCES "Crypto_wallet"("crypto_wallet_id") ON DELETE RESTRICT ON UPDATE CASCADE;
