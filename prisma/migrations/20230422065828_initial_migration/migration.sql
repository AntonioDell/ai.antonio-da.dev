-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "draftedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NewsletterToSubscription" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NewsletterToSubscription_AB_unique" ON "_NewsletterToSubscription"("A", "B");

-- CreateIndex
CREATE INDEX "_NewsletterToSubscription_B_index" ON "_NewsletterToSubscription"("B");

-- AddForeignKey
ALTER TABLE "_NewsletterToSubscription" ADD CONSTRAINT "_NewsletterToSubscription_A_fkey" FOREIGN KEY ("A") REFERENCES "newsletters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsletterToSubscription" ADD CONSTRAINT "_NewsletterToSubscription_B_fkey" FOREIGN KEY ("B") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
