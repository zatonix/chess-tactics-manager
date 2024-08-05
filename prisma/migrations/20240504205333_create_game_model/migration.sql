/*
  Warnings:

  - You are about to drop the column `chesscomUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lichessUsername` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameCategory" AS ENUM ('bullet', 'blitz', 'rapid', 'classical');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('mate', 'draw', 'resign', 'timeout');

-- CreateEnum
CREATE TYPE "GameWinner" AS ENUM ('white', 'black', 'draw');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chesscomUsername",
DROP COLUMN "lichessUsername";

-- CreateTable
CREATE TABLE "ChessAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "fetchTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChessAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "whiteChessAccountId" TEXT,
    "blackChessAccountId" TEXT,
    "category" "GameCategory" NOT NULL,
    "rated" BOOLEAN NOT NULL,
    "whitePlayer" TEXT NOT NULL,
    "whiteRating" INTEGER NOT NULL,
    "blackPlayer" TEXT NOT NULL,
    "blackRating" INTEGER NOT NULL,
    "winner" "GameWinner" NOT NULL,
    "status" "GameStatus" NOT NULL,
    "pgn" TEXT NOT NULL,
    "opening" TEXT NOT NULL,
    "clocks" INTEGER[],
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChessAccount_userId_key" ON "ChessAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChessAccount_provider_username_key" ON "ChessAccount"("provider", "username");

-- AddForeignKey
ALTER TABLE "ChessAccount" ADD CONSTRAINT "ChessAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whiteChessAccountId_fkey" FOREIGN KEY ("whiteChessAccountId") REFERENCES "ChessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackChessAccountId_fkey" FOREIGN KEY ("blackChessAccountId") REFERENCES "ChessAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
