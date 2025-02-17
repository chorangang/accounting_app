-- CreateTable
CREATE TABLE "belongings" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "account_holder_id" TEXT NOT NULL,

    CONSTRAINT "belongings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "belongings_user_id_account_holder_id_key" ON "belongings"("user_id", "account_holder_id");

-- AddForeignKey
ALTER TABLE "belongings" ADD CONSTRAINT "belongings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "belongings" ADD CONSTRAINT "belongings_account_holder_id_fkey" FOREIGN KEY ("account_holder_id") REFERENCES "account_holders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
