/*
  Warnings:

  - You are about to drop the `TypeModule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TypeModule";

-- CreateTable
CREATE TABLE "TestModule" (
    "exampleField" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TestModule_exampleField_key" ON "TestModule"("exampleField");
