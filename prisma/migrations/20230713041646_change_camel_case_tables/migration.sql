/*
  Warnings:

  - The primary key for the `events_on_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `events_on_users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `events_on_users` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `events_on_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `events_on_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events_on_users" DROP CONSTRAINT "events_on_users_eventId_fkey";

-- DropForeignKey
ALTER TABLE "events_on_users" DROP CONSTRAINT "events_on_users_userId_fkey";

-- AlterTable
ALTER TABLE "events_on_users" DROP CONSTRAINT "events_on_users_pkey",
DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "events_on_users_pkey" PRIMARY KEY ("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "events_on_users" ADD CONSTRAINT "events_on_users_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_on_users" ADD CONSTRAINT "events_on_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
