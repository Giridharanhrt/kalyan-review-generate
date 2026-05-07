/*
  Warnings:

  - You are about to drop the column `customerMessage` on the `CustomerReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerReview" DROP COLUMN "customerMessage",
ADD COLUMN     "attenderId" TEXT;
