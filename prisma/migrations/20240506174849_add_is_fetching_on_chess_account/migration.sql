/*
  Warnings:

  - You are about to drop the column `fetchTime` on the `ChessAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChessAccount" DROP COLUMN "fetchTime",
ADD COLUMN     "isFetching" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastFetch" TIMESTAMP(3);
