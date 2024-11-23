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

    const noteUpdates = [];
    const articleUpdates = [];
    const redisDeletes = [];

    for (const key of noteKeys) {
      const noteId = parseInt(key.split(':')[1], 10);
      const views = parseInt(await this.redisService.get(key), 10);

      if (!isNaN(noteId) && !isNaN(views)) {
        noteUpdates.push(
          this.prisma.note.update({
            where: { id: noteId },
            data: { views },
          }),
        );

        redisDeletes.push(key);
      }
    }

    for (const key of articleKeys) {
      const slug = key.split(':')[1];
      const views = parseInt(await this.redisService.get(key), 10);

      if (slug && !isNaN(views)) {
        articleUpdates.push(
          this.prisma.article.update({
            where: { slug },
            data: { views },
          }),
        );

        redisDeletes.push(key);
      }
    }

    if (noteUpdates.length > 0 || articleUpdates.length > 0) {
      await this.prisma.$transaction([...noteUpdates, ...articleUpdates]);

      for (const key of redisDeletes) {
        await this.redisService.delete(key);
      }
    }
  }
}
