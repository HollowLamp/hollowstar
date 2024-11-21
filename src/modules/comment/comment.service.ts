import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { containsBannedWords, loadBannedWords } from 'src/utils/filter-comment';

@Injectable()
export class CommentService {
  private blockedKeywords: string[];
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private configService: ConfigService,
  ) {
    this.blockedKeywords = loadBannedWords();
  }

  async createComment(createCommentDto: CreateCommentDto) {
    if (containsBannedWords(createCommentDto.content, this.blockedKeywords)) {
      throw new BadRequestException('评论内容包含屏蔽词，无法提交');
    }

    await this.mailService.sendNotificationEmail(
      this.configService.get('EMAIL_USER'),
      '新评论通知',
      createCommentDto.nickname || '匿名',
      createCommentDto.content,
    );

    return await this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  async getCommentsByContent(
    contentIdentifier: {
      articleSlug?: string;
      noteId?: number;
      thoughtId?: number;
    },
    page: number,
    limit: number,
    independentOnly: boolean = false,
  ) {
    const skip = (page - 1) * limit;

    const whereCondition = independentOnly
      ? {
          articleSlug: null,
          noteId: null,
          thoughtId: null,
        }
      : contentIdentifier;

    const comments = await this.prisma.comment.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.comment.count({
      where: whereCondition,
    });

    return { data: comments, total, page, limit };
  }

  async deleteComment(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('评论未找到');
    }

    return await this.prisma.comment.delete({ where: { id } });
  }

  async getAllComments(query: {
    page: number;
    limit: number;
    search?: string;
    filterType?: string;
    sortOrder: 'asc' | 'desc';
  }) {
    const { page, limit, search, filterType, sortOrder } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterType === 'article') {
      where.articleSlug = { not: null };
    } else if (filterType === 'note') {
      where.noteId = { not: null };
    } else if (filterType === 'thought') {
      where.thoughtId = { not: null };
    } else if (filterType === 'independent') {
      where.articleSlug = null;
      where.noteId = null;
      where.thoughtId = null;
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { articleSlug: { contains: search, mode: 'insensitive' } },
        { id: isNaN(Number(search)) ? undefined : Number(search) },
      ];
    }

    const comments = await this.prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sortOrder || 'desc' },
    });

    const total = await this.prisma.comment.count({ where });

    return {
      data: comments,
      total,
      page,
      limit,
    };
  }
}
