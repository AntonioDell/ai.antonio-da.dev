/*
  Warnings:

  - You are about to drop the `NewsletterSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionState" AS ENUM ('NOT_VALIDATED', 'ACTIVE', 'CANCELLED');

-- DropTable
DROP TABLE "NewsletterSettings";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL DEFAULT 'WEEKLY',
    "state" "SubscriptionState" NOT NULL DEFAULT 'NOT_VALIDATED',

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_key" ON "Subscription"("email");
