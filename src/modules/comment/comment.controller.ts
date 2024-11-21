import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';

@ApiTags('评论管理')
@Controller('admin/comments')
@ApiBearerAuth()
export class AdminCommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '删除评论' })
  @ApiParam({ name: 'id', description: '评论 ID' })
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.deleteComment(id);
  }

  @ApiOperation({ summary: '获取所有评论（分页，支持搜索与过滤）' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({
    name: 'limit',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '搜索关键字（内容、Slug 或 ID）',
  })
  @ApiQuery({
    name: 'filterType',
    required: false,
    description:
      '过滤类型：article（文章），note（随笔），thought（说说），independent（独立评论）',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: '排序方式：asc 或 desc（默认 desc）',
    example: 'desc',
  })
  @Get()
  async getAllComments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('filterType') filterType?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return await this.commentService.getAllComments({
      page,
      limit,
      search,
      filterType,
      sortOrder,
    });
  }
}

@ApiTags('评论查看')
@Controller('comments')
@IsPublic()
export class PublicCommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '通过文章 slug 获取评论' })
  @ApiParam({ name: 'slug', description: '文章的 slug' })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'limit',
  })
  @Get('article/:slug')
  async getCommentsByArticleSlug(
    @Param('slug') slug: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.commentService.getCommentsByContent(
      { articleSlug: slug },
      page,
      limit,
    );
  }

  @ApiOperation({ summary: '通过随笔 ID 获取评论' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'limit',
  })
  @Get('note/:id')
  async getCommentsByNoteId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.commentService.getCommentsByContent(
      { noteId: id },
      page,
      limit,
    );
  }

  @ApiOperation({ summary: '通过说说 ID 获取评论' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'limit',
  })
  @Get('thought/:id')
  async getCommentsByThoughtId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.commentService.getCommentsByContent(
      { thoughtId: id },
      page,
      limit,
    );
  }

  @ApiOperation({ summary: '获取独立评论' })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'limit',
  })
  @Get('independent')
  async getIndependentComments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.commentService.getCommentsByContent(
      {},
      page,
      limit,
      true,
    );
  }

  @ApiOperation({ summary: '创建评论' })
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.createComment(createCommentDto);
  }
}
