-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('CLAIR', 'SOMBRE');

-- CreateEnum
CREATE TYPE "Langue" AS ENUM ('FR', 'EN', 'IT', 'ES', 'DE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confidentialite" BOOLEAN DEFAULT false,
ADD COLUMN     "langue" "Langue" DEFAULT 'FR',
ADD COLUMN     "theme" "Theme" DEFAULT 'CLAIR';
