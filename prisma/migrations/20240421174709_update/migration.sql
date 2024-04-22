-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "likes" INTEGER DEFAULT 0;
