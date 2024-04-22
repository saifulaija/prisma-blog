/*
  Warnings:

  - You are about to drop the column `likes` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "like";
