/*
  Warnings:

  - The values [BIEN] on the enum `Categorie` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Categorie_new" AS ENUM ('VILLA', 'MAISON', 'APPARTEMENT', 'HOTEL', 'TERRAIN', 'CHANTIER');
ALTER TABLE "public"."Propriete" ALTER COLUMN "categorie" TYPE "public"."Categorie_new" USING ("categorie"::text::"public"."Categorie_new");
ALTER TYPE "public"."Categorie" RENAME TO "Categorie_old";
ALTER TYPE "public"."Categorie_new" RENAME TO "Categorie";
DROP TYPE "public"."Categorie_old";
COMMIT;
