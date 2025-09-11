-- CreateTable
CREATE TABLE "public"."Avis" (
    "id" SERIAL NOT NULL,
    "commentaire" TEXT,
    "note" INTEGER NOT NULL,
    "proprieteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avis_proprieteId_userId_key" ON "public"."Avis"("proprieteId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Avis" ADD CONSTRAINT "Avis_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "public"."Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avis" ADD CONSTRAINT "Avis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
