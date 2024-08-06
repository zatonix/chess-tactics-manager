/*
  Warnings:

  - You are about to drop the `_ChessAccountToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ChessAccountToUser" DROP CONSTRAINT "_ChessAccountToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChessAccountToUser" DROP CONSTRAINT "_ChessAccountToUser_B_fkey";

-- DropTable
DROP TABLE "_ChessAccountToUser";

-- CreateTable
CREATE TABLE "ChessAccountUser" (
    "chessAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChessAccountUser_pkey" PRIMARY KEY ("chessAccountId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChessAccountUser_chessAccountId_userId_key" ON "ChessAccountUser"("chessAccountId", "userId");

-- AddForeignKey
ALTER TABLE "ChessAccountUser" ADD CONSTRAINT "ChessAccountUser_chessAccountId_fkey" FOREIGN KEY ("chessAccountId") REFERENCES "ChessAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChessAccountUser" ADD CONSTRAINT "ChessAccountUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
