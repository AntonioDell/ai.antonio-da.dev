/*
  Warnings:

  - Made the column `draftedAt` on table `newsletters` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "newsletters" ALTER COLUMN "draftedAt" SET NOT NULL;
