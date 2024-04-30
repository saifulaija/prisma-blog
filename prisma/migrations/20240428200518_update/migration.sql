/*
  Warnings:

  - Added the required column `conclusion` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "conclusion" TEXT NOT NULL;
