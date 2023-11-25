-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
