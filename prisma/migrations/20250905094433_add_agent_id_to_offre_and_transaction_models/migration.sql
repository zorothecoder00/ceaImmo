-- AlterTable
ALTER TABLE "public"."Offre" ADD COLUMN     "agentId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "agentId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Offre" ADD CONSTRAINT "Offre_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
