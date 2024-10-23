import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ContentStatus } from 'src/enums/content-status.enum';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(createnoteDto: CreateNoteDto) {
    return await this.prisma.note.create({
      data: createnoteDto,
    });
  }

  async updateNote(id: number, updatenoteDto: UpdateNoteDto) {
    return await this.prisma.note.update({
      where: { id },
      data: updatenoteDto,
    });
  }

  async deleteNote(id: number) {
    return await this.prisma.note.delete({
      where: { id },
    });
  }

  async getAllNotes() {
    return await this.prisma.note.findMany();
  }

  async getNotesByStatus(status: ContentStatus) {
    return this.prisma.note.findMany({
      where: { status },
    });
  }

  async getNoteById(id: number) {
    return this.prisma.note.findUnique({
      where: { id },
    });
  }

  async getPublishedNoteById(id: number) {
    return this.prisma.note.findFirst({
      where: { id, status: ContentStatus.PUBLISHED },
    });
  }
}
