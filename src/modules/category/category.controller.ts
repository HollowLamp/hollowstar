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
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
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
}

@ApiTags('分类查看')
@IsPublic()
@Controller('/categories')
export class PublicCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '获取所有分类' })
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: '获取分类下所有文章' })
  @ApiParam({ name: 'id', description: '分类 ID' })
  @Get(':id')
  async getArticlesByCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getArticlesByCategory(id);
  }
}
