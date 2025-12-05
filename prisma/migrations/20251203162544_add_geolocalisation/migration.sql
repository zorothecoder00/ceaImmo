/*
  Warnings:

  - You are about to drop the column `geolocalisation` on the `Propriete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Propriete" DROP COLUMN "geolocalisation";

-- CreateTable
CREATE TABLE "Geolocalisation" (
    "id" SERIAL NOT NULL,
    "proprieteId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Geolocalisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Geolocalisation_proprieteId_key" ON "Geolocalisation"("proprieteId");

-- AddForeignKey
ALTER TABLE "Geolocalisation" ADD CONSTRAINT "Geolocalisation_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
