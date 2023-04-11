-- CreateTable
CREATE TABLE "Submissions" (
    "id" TEXT NOT NULL,
    "contributerName" TEXT,
    "revealName" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NewsletterSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSettings_email_key" ON "NewsletterSettings"("email");
