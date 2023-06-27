/*
  Warnings:

  - Added the required column `text` to the `testimonies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testimonies" ADD COLUMN     "text" TEXT NOT NULL;
