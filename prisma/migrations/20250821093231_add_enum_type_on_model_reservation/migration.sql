/*
  Warnings:

  - Added the required column `type` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('VISITE', 'LOCATION', 'ACHAT');

-- AlterTable
ALTER TABLE "public"."Reservation" ADD COLUMN     "type" "public"."Type" NOT NULL;
