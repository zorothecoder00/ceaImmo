/*
  Warnings:

  - The `geolocalisation` column on the `Propriete` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Propriete" DROP COLUMN "geolocalisation",
ADD COLUMN     "geolocalisation" JSONB;
