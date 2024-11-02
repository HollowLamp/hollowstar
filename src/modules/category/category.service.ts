import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { name, slug } = createCategoryDto;
    return await this.prisma.category.create({
      data: { name, slug },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { articles: true },
    });

    if (!category) {
      throw new NotFoundException('分类未找到');
    }

    if (category.articles.length > 0) {
      throw new BadRequestException('分类下仍有文章，无法删除');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getAllCategories() {
    return await this.prisma.category.findMany();
  }

  async getAllCategoriesWithArticleCount(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { articles: true },
          },
        },
      }),
      this.prisma.category.count(),
    ]);

    if (!categories || categories.length === 0) {
      throw new NotFoundException('未找到分类');
    }

    return {
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        articleCount: category._count.articles,
      })),
      total,
      page,
      limit,
    };
  }

  async getPublishedArticlesByCategorySlug(
    slug: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { status: 'published' },
          skip,
          take: limit,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类未找到');
    }

    const total = await this.prisma.article.count({
      where: { categoryId: category.id, status: 'published' },
    });

    return {
      data: category.articles,
      total,
      page,
      limit,
    };
  }
}
