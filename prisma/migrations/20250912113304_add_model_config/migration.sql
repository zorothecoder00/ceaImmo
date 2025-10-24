-- CreateTable
CREATE TABLE "public"."Config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
