import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ContentStatus } from 'src/enums/content-status.enum';
import { PaginationResult } from 'src/interface/pagination.interface';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async updateArticle(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async deleteArticle(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  async getArticleById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getPublishedArticleBySlug(slug: string) {
    return this.prisma.article.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: { category: true },
    });
  }

  async getPaginatedArticles(
    page: number,
    limit: number,
    status?: ContentStatus,
    categoryId?: number,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<PaginationResult<any>> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const orderBy = { [sortField]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: true },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
