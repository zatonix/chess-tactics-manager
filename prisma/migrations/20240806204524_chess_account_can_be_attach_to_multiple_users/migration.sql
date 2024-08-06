/*
  Warnings:

  - You are about to drop the column `userId` on the `ChessAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,username]` on the table `ChessAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ChessAccount" DROP CONSTRAINT "ChessAccount_userId_fkey";

-- AlterTable
ALTER TABLE "ChessAccount" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salt" TEXT;

-- CreateTable
CREATE TABLE "ChessAccountUser" (
    "chessAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChessAccountUser_pkey" PRIMARY KEY ("chessAccountId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChessAccountUser_chessAccountId_userId_key" ON "ChessAccountUser"("chessAccountId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChessAccount_provider_username_key" ON "ChessAccount"("provider", "username");

-- AddForeignKey
ALTER TABLE "ChessAccountUser" ADD CONSTRAINT "ChessAccountUser_chessAccountId_fkey" FOREIGN KEY ("chessAccountId") REFERENCES "ChessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChessAccountUser" ADD CONSTRAINT "ChessAccountUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
