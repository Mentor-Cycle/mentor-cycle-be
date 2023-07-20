/*
  Warnings:

  - You are about to drop the `EventsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventsOnUsers" DROP CONSTRAINT "EventsOnUsers_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventsOnUsers" DROP CONSTRAINT "EventsOnUsers_userId_fkey";

-- DropTable
DROP TABLE "EventsOnUsers";

-- CreateTable
CREATE TABLE "events_on_users" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "events_on_users_pkey" PRIMARY KEY ("eventId","userId")
);

-- AddForeignKey
ALTER TABLE "events_on_users" ADD CONSTRAINT "events_on_users_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_on_users" ADD CONSTRAINT "events_on_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
