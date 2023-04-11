/*
  Warnings:

  - Changed the type of `frequency` on the `NewsletterSettings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "NewsletterSettings" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "Frequency" NOT NULL;
