-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "dateNotification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emetteurId" INTEGER,
ADD COLUMN     "lien" TEXT,
ADD COLUMN     "vu" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_emetteurId_fkey" FOREIGN KEY ("emetteurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
