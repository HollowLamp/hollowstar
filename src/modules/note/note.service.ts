import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ContentStatus } from 'src/enums/content-status.enum';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class NoteService {
  constructor(
    private readonly prisma: PrismaService,
    private redisService: RedisService,
  ) {}

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

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

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

  async getPublishedNoteById(id: number, ip: string) {
    const viewKey = `note:${id}:views`;
    const ipKey = `note:${id}:ip:${ip}`;

    const note = await this.prisma.note.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
    });

    if (!note) {
      throw new NotFoundException('Note未找到');
    }

    let redisViews = await this.redisService.get(viewKey);
    if (!redisViews) {
      redisViews = note.views.toString();
      await this.redisService.set(viewKey, redisViews);
    }

    const isVisited = await this.redisService.get(ipKey);
    if (!isVisited) {
      await this.redisService.increment(viewKey);
      await this.redisService.set(ipKey, '1', 600);
    }

    const views = parseInt(await this.redisService.get(viewKey), 10);

    return { ...note, views };
  }
}
