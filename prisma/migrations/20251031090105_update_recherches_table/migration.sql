/*
  Warnings:

  - You are about to drop the column `localisation` on the `Recherche` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recherche" DROP COLUMN "localisation",
ADD COLUMN     "geolocalisation" TEXT;
