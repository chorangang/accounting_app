-- CreateTable
CREATE TABLE "receipts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_journalized" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);
