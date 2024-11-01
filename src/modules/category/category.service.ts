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

  async getAllCategoriesWithArticleCount() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!categories || categories.length === 0) {
      throw new NotFoundException('未找到分类');
    }

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      articleCount: category._count.articles,
    }));
  }

  async getPublishedArticlesByCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        articles: {
          where: {
            status: 'published',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('分类未找到');
    }

    return category.articles;
  }
}
