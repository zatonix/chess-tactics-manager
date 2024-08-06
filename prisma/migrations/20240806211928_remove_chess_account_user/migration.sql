/*
  Warnings:

  - You are about to drop the `ChessAccountUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChessAccountUser" DROP CONSTRAINT "ChessAccountUser_chessAccountId_fkey";

-- DropForeignKey
ALTER TABLE "ChessAccountUser" DROP CONSTRAINT "ChessAccountUser_userId_fkey";

-- DropTable
DROP TABLE "ChessAccountUser";

-- CreateTable
CREATE TABLE "_ChessAccountToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChessAccountToUser_AB_unique" ON "_ChessAccountToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChessAccountToUser_B_index" ON "_ChessAccountToUser"("B");

-- AddForeignKey
ALTER TABLE "_ChessAccountToUser" ADD CONSTRAINT "_ChessAccountToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChessAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChessAccountToUser" ADD CONSTRAINT "_ChessAccountToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
