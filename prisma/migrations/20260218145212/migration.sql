/*
  Warnings:

  - The values [USER] on the enum `currency_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "currency_type_new" AS ENUM ('FIAT', 'CRYPTO');
ALTER TABLE "Transaction" ALTER COLUMN "currency_type" TYPE "currency_type_new" USING ("currency_type"::text::"currency_type_new");
ALTER TYPE "currency_type" RENAME TO "currency_type_old";
ALTER TYPE "currency_type_new" RENAME TO "currency_type";
DROP TYPE "public"."currency_type_old";
COMMIT;
