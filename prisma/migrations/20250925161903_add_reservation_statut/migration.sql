-- CreateEnum
CREATE TYPE "public"."ReservationStatut" AS ENUM ('DEMANDEE', 'CONFIRMEE', 'ANNULEE', 'REPORTEE');

-- AlterTable
ALTER TABLE "public"."Reservation" ADD COLUMN     "statut" "public"."ReservationStatut" NOT NULL DEFAULT 'DEMANDEE';
