// src/modules/category/category.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('分类管理')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建分类' })
  @Post()
  @ApiBearerAuth()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: '更新分类' })
  @Put(':id')
  @ApiBearerAuth()
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: '删除分类' })
  @Delete(':id')
  @ApiBearerAuth()
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteCategory(id);
  }

  @ApiOperation({ summary: '获取所有分类' })
  @Get()
  @IsPublic()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: '获取分类下所有文章' })
  @Get(':id')
  @IsPublic()
  async getArticlesByCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getArticlesByCategory(id);
  }
}
