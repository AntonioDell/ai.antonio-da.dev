/*
  Warnings:

  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Submission";

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "contributerName" TEXT,
    "revealName" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);
