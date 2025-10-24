/*
  Warnings:

  - The values [VISITE,ACHAT] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ReservationVisite" AS ENUM ('DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'REPORTEE');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Type_new" AS ENUM ('SEJOUR', 'LOCATION');
ALTER TABLE "public"."Reservation" ALTER COLUMN "type" TYPE "public"."Type_new" USING ("type"::text::"public"."Type_new");
ALTER TYPE "public"."Type" RENAME TO "Type_old";
ALTER TYPE "public"."Type_new" RENAME TO "Type";
DROP TYPE "public"."Type_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."Visite" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statut" "public"."ReservationVisite" NOT NULL DEFAULT 'DEMANDEE',
    "userId" INTEGER NOT NULL,
    "agentId" INTEGER,
    "proprieteId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Visite" ADD CONSTRAINT "Visite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visite" ADD CONSTRAINT "Visite_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visite" ADD CONSTRAINT "Visite_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "public"."Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
