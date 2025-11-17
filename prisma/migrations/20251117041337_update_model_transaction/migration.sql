/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerTransactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatutTransaction" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'REUSSIE', 'ECHOUEE', 'ANNULEE', 'REMBOURSEE');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amount" BIGINT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'XOF',
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "fees" BIGINT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "netAmount" BIGINT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "providerPaymentIntent" TEXT,
ADD COLUMN     "providerTransactionId" TEXT,
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "statut" "StatutTransaction" NOT NULL DEFAULT 'EN_ATTENTE';

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_providerTransactionId_key" ON "Transaction"("providerTransactionId");

-- CreateIndex
CREATE INDEX "Transaction_provider_providerTransactionId_idx" ON "Transaction"("provider", "providerTransactionId");
