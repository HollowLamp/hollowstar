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

  async getAllThoughts() {
    return await this.prisma.thought.findMany();
  }

  async getThoughtsByStatus(status: ContentStatus) {
    return this.prisma.thought.findMany({
      where: { status },
    });
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
