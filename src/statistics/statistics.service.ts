import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../database/prisma.service';
import { ContentStatus } from 'src/enums/content-status.enum';
import { htmlToText } from 'html-to-text';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async getAllViews() {
    let articleViews = 0;
    let noteViews = 0;

    const articleKeys = await this.redisService.scan('article:*:views');
    const noteKeys = await this.redisService.scan('note:*:views');

    if (articleKeys.length > 0) {
      for (const key of articleKeys) {
        const views = parseInt(await this.redisService.get(key), 10);
        if (!isNaN(views)) {
          articleViews += views;
        }
      }
    } else {
      const articleDbSum = await this.prisma.article.aggregate({
        _sum: { views: true },
      });
      articleViews = articleDbSum._sum.views || 0;

      const articles = await this.prisma.article.findMany({
        select: { slug: true, views: true },
      });
      for (const article of articles) {
        await this.redisService.set(
          `article:${article.slug}:views`,
          article.views,
        );
      }
    }

    if (noteKeys.length > 0) {
      for (const key of noteKeys) {
        const views = parseInt(await this.redisService.get(key), 10);
        if (!isNaN(views)) {
          noteViews += views;
        }
      }
    } else {
      const noteDbSum = await this.prisma.note.aggregate({
        _sum: { views: true },
      });
      noteViews = noteDbSum._sum.views || 0;

      const notes = await this.prisma.note.findMany({
        select: { id: true, views: true },
      });
      for (const note of notes) {
        await this.redisService.set(`note:${note.id}:views`, note.views);
      }
    }

    return {
      articleViews,
      noteViews,
    };
  }

  async getCounts() {
    const [
      categoryCount,
      publishedArticleCount,
      publishedNoteCount,
      publishedThoughtCount,
      commentCount,
    ] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.article.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.note.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.thought.count({
        where: { status: ContentStatus.PUBLISHED },
      }),
      this.prisma.comment.count(),
    ]);

    return {
      categoryCount,
      publishedArticleCount,
      publishedNoteCount,
      publishedThoughtCount,
      commentCount,
    };
  }

  async getDailyViewsRange(startDate: string, endDate: string) {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const articleViews = await this.prisma.articleViewLog.groupBy({
      by: ['createdAt'],
      _sum: {
        viewCount: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const noteViews = await this.prisma.noteViewLog.groupBy({
      by: ['createdAt'],
      _sum: {
        viewCount: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const result: { date: string; articleViews: number; noteViews: number }[] =
      [];
    const dates = this.generateDateRange(startDate, endDate);

    dates.forEach((date) => {
      const articleView = articleViews.find(
        (view) => view.createdAt.toISOString().split('T')[0] === date,
      );
      const noteView = noteViews.find(
        (view) => view.createdAt.toISOString().split('T')[0] === date,
      );

      result.push({
        date,
        articleViews: articleView?._sum.viewCount || 0,
        noteViews: noteView?._sum.viewCount || 0,
      });
    });

    return result;
  }

  private generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  async getMonthlyViewsRange(startDate: string, endDate: string) {
    const dailyViews = await this.getDailyViewsRange(startDate, endDate);

    const monthlyViews = dailyViews.reduce(
      (acc, day) => {
        const date = new Date(day.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const key = `${year}-${month}`;
        if (!acc[key]) {
          acc[key] = { year, month, articleViews: 0, noteViews: 0 };
        }

        acc[key].articleViews += day.articleViews;
        acc[key].noteViews += day.noteViews;

        return acc;
      },
      {} as Record<
        string,
        { year: number; month: number; articleViews: number; noteViews: number }
      >,
    );

    return Object.values(monthlyViews).sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.month - b.month;
    });
  }

  private async countWords(contents: string[]): Promise<number> {
    return contents
      .map((html) => htmlToText(html))
      .reduce((total, text) => total + text.length, 0);
  }

  async getContentWordCount() {
    const articles = await this.prisma.article.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { content: true },
    });
    const articleWordCount = await this.countWords(
      articles.map((a) => a.content),
    );

    const notes = await this.prisma.note.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { content: true },
    });
    const noteWordCount = await this.countWords(notes.map((n) => n.content));

    const thoughts = await this.prisma.thought.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { content: true },
    });
    const thoughtWordCount = await this.countWords(
      thoughts.map((t) => t.content),
    );

    return {
      articleWordCount,
      noteWordCount,
      thoughtWordCount,
    };
  }
}
