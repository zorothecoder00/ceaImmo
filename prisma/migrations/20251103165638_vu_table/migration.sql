-- AlterTable
ALTER TABLE "Propriete" ADD COLUMN     "nombreVu" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Vu" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "proprieteId" INTEGER NOT NULL,
    "dateVu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vu_userId_proprieteId_key" ON "Vu"("userId", "proprieteId");

-- AddForeignKey
ALTER TABLE "Vu" ADD CONSTRAINT "Vu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vu" ADD CONSTRAINT "Vu_proprieteId_fkey" FOREIGN KEY ("proprieteId") REFERENCES "Propriete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
