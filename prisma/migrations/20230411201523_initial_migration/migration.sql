/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Subscription";

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL DEFAULT 'WEEKLY',
    "state" "SubscriptionState" NOT NULL DEFAULT 'NOT_VALIDATED',

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_email_key" ON "Subscriptions"("email");
