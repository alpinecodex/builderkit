-- AlterTable
ALTER TABLE "User" ADD COLUMN     "anthropicKey" TEXT,
ADD COLUMN     "copyLeaksKey" TEXT,
ADD COLUMN     "openAiKey" TEXT,
ADD COLUMN     "wordpressKey" TEXT;

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
