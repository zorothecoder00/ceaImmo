/*
  Warnings:

  - The `statut` column on the `Visite` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."VisiteStatut" AS ENUM ('DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'REPORTEE');

-- AlterTable
ALTER TABLE "public"."Visite" DROP COLUMN "statut",
ADD COLUMN     "statut" "public"."VisiteStatut" NOT NULL DEFAULT 'DEMANDEE';

-- DropEnum
DROP TYPE "public"."ReservationVisite";
