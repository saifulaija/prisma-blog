-- CreateEnum
CREATE TYPE "Published_status" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "publishedStatus" "Published_status";
