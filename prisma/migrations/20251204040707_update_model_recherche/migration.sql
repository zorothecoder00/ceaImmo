/*
  Warnings:

  - You are about to drop the column `geolocalisation` on the `Recherche` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recherche" DROP COLUMN "geolocalisation",
ADD COLUMN     "geolocalisationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Recherche" ADD CONSTRAINT "Recherche_geolocalisationId_fkey" FOREIGN KEY ("geolocalisationId") REFERENCES "Geolocalisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
