import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('分类管理')
@ApiBearerAuth()
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: '更新分类' })
  @ApiParam({ name: 'id', description: '分类 ID' })
  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: '删除分类' })
  @ApiParam({ name: 'id', description: '分类 ID' })
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }

  @ApiOperation({ summary: '分页获取所有分类及其下所有文章数目' })
  @Get()
  async getAllCategoriesWithArticleCount(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return await this.categoryService.getAllCategoriesWithArticleCount(
      page,
      limit,
    );
  }
}

@ApiTags('分类查看')
@IsPublic()
@Controller('/categories')
export class PublicCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '获取所有分类及其下所有已发布文章数目' })
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategoriesWithPublishedArticleCount();
  }

  @ApiOperation({ summary: '通过 slug 分页获取分类下所有已发布文章' })
  @ApiParam({ name: 'slug', description: '分类 slug' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @Get(':slug')
  async getPublishedArticlesByCategorySlug(
    @Param('slug') slug: string,
    @Query('page', ParseIntPipe) page,
    @Query('limit', ParseIntPipe) limit,
  ) {
    return await this.categoryService.getPublishedArticlesByCategorySlug(
      slug,
      page,
      limit,
    );
  }
}
