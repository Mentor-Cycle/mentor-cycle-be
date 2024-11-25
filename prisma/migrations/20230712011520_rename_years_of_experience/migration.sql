/*
  Warnings:

  - You are about to drop the column `years_of_experience` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "years_of_experience",
ADD COLUMN     "experience" TEXT;
