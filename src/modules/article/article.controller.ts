import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
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
    @Param('id', ParseIntPipe) id,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.updateArticle(id, updateArticleDto);
  }

  @ApiOperation({ summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章 ID' })
  @Delete(':id')
  async deleteArticle(@Param('id', ParseIntPipe) id) {
    return await this.articleService.deleteArticle(id);
  }

  @ApiOperation({ summary: '获取所有文章' })
  @Get()
  async getAllArticles() {
    return await this.articleService.getAllArticles();
  }

  @ApiOperation({ summary: '获取所有隐藏文章' })
  @Get('hidden')
  async getHiddenArticles() {
    return this.articleService.getArticlesByStatus(ContentStatus.HIDDEN);
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

  @ApiOperation({ summary: '获取所有已发布文章' })
  @Get()
  async getPublishedArticles() {
    return this.articleService.getArticlesByStatus(ContentStatus.PUBLISHED);
  }

  @ApiOperation({ summary: '根据ID获取已发布文章' })
  @ApiParam({ name: 'id', description: '文章 ID' })
  @Get(':id')
  async getPublishedArticleById(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getPublishedArticleById(id);
  }
}
