/*
  Warnings:

  - You are about to drop the column `body` on the `Draft` table. All the data in the column will be lost.
  - Added the required column `content` to the `Draft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Draft" DROP COLUMN "body",
ADD COLUMN     "content" JSONB NOT NULL;
