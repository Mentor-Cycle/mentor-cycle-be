-- DropForeignKey
ALTER TABLE "notifications_data" DROP CONSTRAINT "notifications_data_user_id_fkey";

-- AlterTable
ALTER TABLE "notifications_data" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications_data" ADD CONSTRAINT "notifications_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
