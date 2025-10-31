-- CreateTable
CREATE TABLE "Recherche" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "titre" TEXT,
    "categorie" "Categorie",
    "minPrix" BIGINT,
    "maxPrix" BIGINT,
    "minSurface" BIGINT,
    "maxSurface" BIGINT,
    "localisation" TEXT,
    "statut" "Statut",
    "nombreChambres" INTEGER,
    "triPar" TEXT,
    "motsCles" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recherche_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recherche" ADD CONSTRAINT "Recherche_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
