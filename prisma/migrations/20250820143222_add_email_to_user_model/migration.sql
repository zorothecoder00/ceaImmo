/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;
