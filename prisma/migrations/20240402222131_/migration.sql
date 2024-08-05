/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chesscomUsername" TEXT,
ADD COLUMN     "lichessUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userId_key" ON "VerificationToken"("userId");
