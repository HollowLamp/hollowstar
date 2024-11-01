import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ContentStatus } from 'src/enums/content-status.enum';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  async updateNote(id: number, updateNoteDto: UpdateNoteDto) {
    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async deleteNote(id: number) {
    return this.prisma.note.delete({
      where: { id },
    });
  }

  async getPaginatedNotes(
    page: number,
    limit: number,
    status?: ContentStatus,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    // 构建 `where` 条件
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' }; // 忽略大小写的搜索
    }

    // 排序
    const orderBy = { [sortField]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.note.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getNoteById(id: number) {
    return this.prisma.note.findUnique({ where: { id } });
  }

  async getPublishedNoteById(id: number) {
    return this.prisma.note.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
    });
  }
}
