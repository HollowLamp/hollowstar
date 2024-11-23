import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async syncViewsToDatabase() {
    const noteKeys = await this.redisService.scan('note:*:views');
    const articleKeys = await this.redisService.scan('article:*:views');

    const noteLogs = [];
    const articleLogs = [];

    for (const key of noteKeys) {
      const noteId = parseInt(key.split(':')[1], 10);
      const redisViews = parseInt(await this.redisService.get(key), 10);

      if (!isNaN(noteId) && !isNaN(redisViews)) {
        const dbNote = await this.prisma.note.findUnique({
          where: { id: noteId },
          select: { views: true },
        });

        const dbViews = dbNote?.views || 0;
        const increment = redisViews - dbViews;

        if (increment > 0) {
          noteLogs.push(
            this.prisma.noteViewLog.create({
              data: {
                noteId,
                viewCount: increment,
              },
            }),
          );

          await this.prisma.note.update({
            where: { id: noteId },
            data: { views: redisViews },
          });

          await this.redisService.delete(key);
        }
      }
    }

    for (const key of articleKeys) {
      const articleSlug = key.split(':')[1];
      const redisViews = parseInt(await this.redisService.get(key), 10);

      if (!isNaN(redisViews)) {
        const dbArticle = await this.prisma.article.findUnique({
          where: { slug: articleSlug },
          select: { views: true },
        });

        const dbViews = dbArticle?.views || 0;
        const increment = redisViews - dbViews;

        if (increment > 0) {
          articleLogs.push(
            this.prisma.articleViewLog.create({
              data: {
                articleSlug,
                viewCount: increment,
              },
            }),
          );

          await this.prisma.article.update({
            where: { slug: articleSlug },
            data: { views: redisViews },
          });

          await this.redisService.delete(key);
        }
      }
    }

    await Promise.all([...noteLogs, ...articleLogs]);
  }
}
