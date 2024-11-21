/*
  Warnings:

  - You are about to drop the column `articleId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "articleId",
ADD COLUMN     "articleSlug" TEXT,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "clientIp" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "website" TEXT;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleSlug_fkey" FOREIGN KEY ("articleSlug") REFERENCES "Article"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
