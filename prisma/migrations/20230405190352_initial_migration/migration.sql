-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "contributerName" TEXT,
    "revealName" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
