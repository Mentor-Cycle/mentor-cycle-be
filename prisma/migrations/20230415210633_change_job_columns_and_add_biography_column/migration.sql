/*
  Warnings:

  - You are about to drop the column `jobDescription` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "jobDescription",
DROP COLUMN "jobTitle",
ADD COLUMN     "bigraphy" TEXT,
ADD COLUMN     "job_company" TEXT,
ADD COLUMN     "job_title" TEXT;
