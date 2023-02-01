-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "any_unique_text" TEXT NOT NULL,
    "any_non_unique_text" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_any_unique_text_key" ON "test"("any_unique_text");
