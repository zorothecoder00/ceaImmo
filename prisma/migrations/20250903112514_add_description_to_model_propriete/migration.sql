/*
  Warnings:

  - You are about to drop the column `status` on the `Propriete` table. All the data in the column will be lost.
  - Added the required column `statut` to the `Propriete` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Statut" AS ENUM ('VENDU', 'DISPONIBLE', 'RESERVE');

-- AlterTable
ALTER TABLE "public"."Propriete" DROP COLUMN "status",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "statut" "public"."Statut" NOT NULL;

-- DropEnum
DROP TYPE "public"."Status";
