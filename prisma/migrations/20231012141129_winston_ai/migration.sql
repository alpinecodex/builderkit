/*
  Warnings:

  - You are about to drop the column `copyLeaksKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "copyLeaksKey",
ADD COLUMN     "winstonAiKey" TEXT;
