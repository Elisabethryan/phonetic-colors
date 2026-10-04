/*
  Warnings:

  - You are about to drop the column `content` on the `Text` table. All the data in the column will be lost.
  - Added the required column `title` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcription` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Text" DROP COLUMN "content",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "transcription" TEXT NOT NULL;
