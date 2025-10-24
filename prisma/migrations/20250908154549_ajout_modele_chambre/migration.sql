/*
  Warnings:

  - You are about to drop the column `date` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `duree` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `dateArrivee` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateDepart` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreVoyageurs` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Propriete" ADD COLUMN     "nombreChambres" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Reservation" DROP COLUMN "date",
DROP COLUMN "duree",
ADD COLUMN     "chambreId" INTEGER,
ADD COLUMN     "dateArrivee" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateDepart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nombreVoyageurs" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Chambre" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prixParNuit" INTEGER NOT NULL,
    "capacite" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "proprieteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chambre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Chambre" ADD CONSTRAINT "Chambre_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "public"."Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "public"."Chambre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
