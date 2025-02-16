/*
  Warnings:

  - You are about to drop the `AccountHolder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AccountHolder";

-- CreateTable
CREATE TABLE "account_holders" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "start_month" INTEGER NOT NULL,
    "closing_month" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_holders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_holders_id_name_key" ON "account_holders"("id", "name");
