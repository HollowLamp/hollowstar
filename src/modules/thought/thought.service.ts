import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { ContentStatus } from 'src/enums/content-status.enum';

@Injectable()
export class ThoughtService {
  constructor(private readonly prisma: PrismaService) {}

  async createThought(createThoughtDto: CreateThoughtDto) {
    return await this.prisma.thought.create({
      data: createThoughtDto,
    });
  }

  async updateThought(id: number, updateThoughtDto: UpdateThoughtDto) {
    return await this.prisma.thought.update({
      where: { id },
      data: updateThoughtDto,
    });
  }

  async deleteThought(id: number) {
    return await this.prisma.thought.delete({
      where: { id },
    });
  }

  async getPaginatedThoughts(
    page: number,
    limit: number,
    status?: ContentStatus,
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const orderBy = { createdAt: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.thought.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.thought.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getThoughtById(id: number) {
    return this.prisma.thought.findUnique({
      where: { id },
    });
  }

  async getPublishedThoughtById(id: number) {
    return this.prisma.thought.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
    });
  }
}
