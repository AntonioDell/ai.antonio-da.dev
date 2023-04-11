/*
  Warnings:

  - You are about to drop the `Submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Submissions";

-- DropTable
DROP TABLE "Subscriptions";

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

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL DEFAULT 'WEEKLY',
    "state" "SubscriptionState" NOT NULL DEFAULT 'NOT_VALIDATED',

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_email_key" ON "subscriptions"("email");
