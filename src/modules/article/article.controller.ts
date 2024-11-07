import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { ContentStatus } from 'src/enums/content-status.enum';

@ApiTags('文章管理')
@ApiBearerAuth()
@Controller('admin/articles')
export class AdminArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '创建文章' })
  @Post()
  async createArticle(@Body() createArticleDto: CreateArticleDto) {
    return await this.articleService.createArticle(createArticleDto);
  }

  @ApiOperation({ summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章 ID' })
  @Put(':id')
  async updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.updateArticle(id, updateArticleDto);
  }

  @ApiOperation({ summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章 ID' })
  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.deleteArticle(id);
  }

  @ApiOperation({ summary: '分页获取所有文章' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({
    name: 'limit',
  })
  @ApiQuery({ name: 'status', required: false, description: '文章状态' })
  @ApiQuery({ name: 'categoryId', required: false, description: '分类 ID' })
  @ApiQuery({
    name: 'sortField',
    required: false,
    description: '排序字段，默认为 createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: '排序顺序，asc 或 desc，默认为 desc',
  })
  @ApiQuery({ name: 'search', required: false, description: '搜索关键字' })
  @Get()
  async getAllArticles(
    @Query('page', ParseIntPipe) page,
    @Query('limit', ParseIntPipe) limit,
    @Query('status') status?: ContentStatus,
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return await this.articleService.getPaginatedArticles(
      page,
      limit,
      status,
      categoryId,
      sortField,
      sortOrder,
      search,
    );
  }

  @ApiOperation({ summary: '根据ID获取文章' })
  @ApiParam({ name: 'id', description: '文章 ID' })
  @Get(':id')
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getArticleById(id);
  }
}

@ApiTags('文章查看')
@IsPublic()
@Controller('/articles')
export class PublicArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '分页获取所有已发布文章' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @Get()
  async getPublishedArticles(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.articleService.getPaginatedArticles(
      page,
      limit,
      ContentStatus.PUBLISHED,
    );
  }

  @ApiOperation({ summary: '根据slug获取已发布文章' })
  @ApiParam({ name: 'slug', description: '文章slug' })
  @Get(':slug')
  async getPublishedArticleById(@Param('slug') slug: string) {
    return this.articleService.getPublishedArticleBySlug(slug);
  }
}
