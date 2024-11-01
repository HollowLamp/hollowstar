import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ContentStatus } from 'src/enums/content-status.enum';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(createArticleDto: CreateArticleDto) {
    return await this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async updateArticle(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async deleteArticle(id: number) {
    return await this.prisma.article.delete({
      where: { id },
    });
  }

  async getAllArticles() {
    return await this.prisma.article.findMany({
      include: { category: true },
    });
  }

  async getArticlesByStatus(status: ContentStatus) {
    return this.prisma.article.findMany({
      where: { status },
      include: { category: true },
    });
  }

  async getArticleById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getPublishedArticleById(id: number) {
    return this.prisma.article.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
      include: { category: true },
    });
  }
}
