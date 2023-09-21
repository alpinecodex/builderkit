/*
  Warnings:

  - You are about to drop the column `wordpressKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "wordpressKey",
ADD COLUMN     "wordpressPassword" TEXT,
ADD COLUMN     "wordpressUrl" TEXT,
ADD COLUMN     "wordpressUsername" TEXT;
