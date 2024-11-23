/*
  Warnings:

  - You are about to drop the column `articleId` on the `ArticleViewLog` table. All the data in the column will be lost.
  - Added the required column `articleSlug` to the `ArticleViewLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleViewLog" DROP CONSTRAINT "ArticleViewLog_articleId_fkey";

-- AlterTable
ALTER TABLE "ArticleViewLog" DROP COLUMN "articleId",
ADD COLUMN     "articleSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ArticleViewLog" ADD CONSTRAINT "ArticleViewLog_articleSlug_fkey" FOREIGN KEY ("articleSlug") REFERENCES "Article"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
