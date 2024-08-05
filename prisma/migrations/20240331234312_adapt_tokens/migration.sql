-- AlterTable
ALTER TABLE "VerificationToken" ALTER COLUMN "expires" DROP NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier");
