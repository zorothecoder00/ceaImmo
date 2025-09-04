/*
  Warnings:

  - A unique constraint covering the columns `[offreId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."OffreStatut" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'EXPIREE');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "offreId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Offre" (
    "id" SERIAL NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" "public"."OffreStatut" NOT NULL DEFAULT 'EN_ATTENTE',
    "message" TEXT,
    "userId" INTEGER NOT NULL,
    "proprieteId" INTEGER NOT NULL,
    "reservationId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_offreId_key" ON "public"."Transaction"("offreId");

-- AddForeignKey
ALTER TABLE "public"."Offre" ADD CONSTRAINT "Offre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offre" ADD CONSTRAINT "Offre_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "public"."Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offre" ADD CONSTRAINT "Offre_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "public"."Offre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
