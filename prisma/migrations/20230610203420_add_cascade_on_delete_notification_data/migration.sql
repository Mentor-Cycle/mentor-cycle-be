-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notification_data_id_fkey";

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_data_id_fkey" FOREIGN KEY ("notification_data_id") REFERENCES "notifications_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
