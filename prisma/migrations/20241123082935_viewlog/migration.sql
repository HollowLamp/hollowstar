-- CreateTable
CREATE TABLE "ArticleViewLog" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteViewLog" (
    "id" SERIAL NOT NULL,
    "noteId" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteViewLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleViewLog" ADD CONSTRAINT "ArticleViewLog_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteViewLog" ADD CONSTRAINT "NoteViewLog_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
