-- CreateEnum
CREATE TYPE "order_type" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('OPEN', 'MATCHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('FIAT_DEPOSIT', 'FIAT_WITHDRAWAL', 'TRANSFER', 'BUY', 'SELL');

-- CreateEnum
CREATE TYPE "p2p_type" AS ENUM ('CRETAED', 'PAID', 'COMPLETED');

-- CreateEnum
CREATE TYPE "currency_type" AS ENUM ('FIAT', 'CRYPTO');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Fiat" (
    "fiat_id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Fiat_pkey" PRIMARY KEY ("fiat_id")
);

-- CreateTable
CREATE TABLE "Crypto" (
    "crypto_id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "network" TEXT NOT NULL,

    CONSTRAINT "Crypto_pkey" PRIMARY KEY ("crypto_id")
);

-- CreateTable
CREATE TABLE "Fiat_wallet" (
    "fiat__wallet_id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "fiat_id" INTEGER NOT NULL,

    CONSTRAINT "Fiat_wallet_pkey" PRIMARY KEY ("fiat__wallet_id")
);

-- CreateTable
CREATE TABLE "Crypto_wallet" (
    "crypto__wallet_id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,

    CONSTRAINT "Crypto_wallet_pkey" PRIMARY KEY ("crypto__wallet_id")
);

-- CreateTable
CREATE TABLE "Back_account" (
    "back_account_id" SERIAL NOT NULL,
    "account_name" TEXT NOT NULL,
    "bank_account_number" TEXT NOT NULL,
    "back_account_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Back_account_pkey" PRIMARY KEY ("back_account_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "order_type" "order_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "order_status" "order_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "fiat_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "trade_id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "traded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "buy_order_id" INTEGER NOT NULL,
    "sell_order_id" INTEGER NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("trade_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" SERIAL NOT NULL,
    "transaction_type" "transaction_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency_type" "currency_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "P2p" (
    "p2p_id" SERIAL NOT NULL,
    "order_type" "order_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "payment_method" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "crypto_id" INTEGER NOT NULL,
    "fiat_id" INTEGER NOT NULL,

    CONSTRAINT "P2p_pkey" PRIMARY KEY ("p2p_id")
);

-- CreateTable
CREATE TABLE "P2p_order" (
    "p2p_order_id" SERIAL NOT NULL,
    "buy_p2p_order_id" INTEGER NOT NULL,
    "sell_p2p_order_id" INTEGER NOT NULL,

    CONSTRAINT "P2p_order_pkey" PRIMARY KEY ("p2p_order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Fiat_wallet" ADD CONSTRAINT "Fiat_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiat_wallet" ADD CONSTRAINT "Fiat_wallet_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "Fiat"("fiat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_wallet" ADD CONSTRAINT "Crypto_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crypto_wallet" ADD CONSTRAINT "Crypto_wallet_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Crypto"("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Back_account" ADD CONSTRAINT "Back_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "Fiat"("fiat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Crypto"("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_buy_order_id_fkey" FOREIGN KEY ("buy_order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_sell_order_id_fkey" FOREIGN KEY ("sell_order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2p" ADD CONSTRAINT "P2p_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2p" ADD CONSTRAINT "P2p_crypto_id_fkey" FOREIGN KEY ("crypto_id") REFERENCES "Crypto"("crypto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2p" ADD CONSTRAINT "P2p_fiat_id_fkey" FOREIGN KEY ("fiat_id") REFERENCES "Fiat"("fiat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2p_order" ADD CONSTRAINT "P2p_order_buy_p2p_order_id_fkey" FOREIGN KEY ("buy_p2p_order_id") REFERENCES "P2p"("p2p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "P2p_order" ADD CONSTRAINT "P2p_order_sell_p2p_order_id_fkey" FOREIGN KEY ("sell_p2p_order_id") REFERENCES "P2p"("p2p_id") ON DELETE RESTRICT ON UPDATE CASCADE;
