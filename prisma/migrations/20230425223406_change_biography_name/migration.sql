/*
  Warnings:

  - You are about to drop the column `bigraphy` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "bigraphy",
ADD COLUMN     "biography" TEXT;
