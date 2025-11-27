-- CreateTable
CREATE TABLE "Signalement" (
    "id" SERIAL NOT NULL,
    "proprieteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "raison" TEXT NOT NULL,
    "description" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signalement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Signalement_proprieteId_idx" ON "Signalement"("proprieteId");

-- CreateIndex
CREATE INDEX "Signalement_userId_idx" ON "Signalement"("userId");

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signalement" ADD CONSTRAINT "Signalement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
