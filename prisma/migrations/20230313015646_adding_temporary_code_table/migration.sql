-- CreateTable
CREATE TABLE "temporary_codes" (
    "id" TEXT NOT NULL,
    "temporary_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_pin" BOOLEAN DEFAULT false,
    "expires_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temporary_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "temporary_codes" ADD CONSTRAINT "temporary_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
