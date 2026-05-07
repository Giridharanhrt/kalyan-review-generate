/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `sendSMS` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `sendWhatsApp` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `shopEmail` on the `CustomerReview` table. All the data in the column will be lost.
  - You are about to drop the column `shopName` on the `CustomerReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerReview" DROP COLUMN "customerEmail",
DROP COLUMN "phoneNumber",
DROP COLUMN "productName",
DROP COLUMN "rating",
DROP COLUMN "sendSMS",
DROP COLUMN "sendWhatsApp",
DROP COLUMN "shopEmail",
DROP COLUMN "shopName",
ADD COLUMN     "attenderName" TEXT,
ADD COLUMN     "brandLoyalty" TEXT,
ADD COLUMN     "customerFrom" TEXT,
ADD COLUMN     "customerMessage" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "emotionalConnection" TEXT,
ADD COLUMN     "events" TEXT,
ADD COLUMN     "improvementAreas" TEXT,
ADD COLUMN     "keyHighlights" TEXT,
ADD COLUMN     "orgName" TEXT NOT NULL DEFAULT 'Kalyan Jewellers',
ADD COLUMN     "orgType" TEXT NOT NULL DEFAULT 'Jewellery Store',
ADD COLUMN     "purchaseType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "recommendationLikelihood" INTEGER NOT NULL DEFAULT 9,
ADD COLUMN     "satisfactionLevel" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "shopLocation" TEXT;
