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
import { ThoughtService } from './thought.service';
import { CreateThoughtDto } from './dto/create-thought.dto';
import { UpdateThoughtDto } from './dto/update-thought.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { ContentStatus } from 'src/enums/content-status.enum';

@ApiTags('说说管理')
@ApiBearerAuth()
@Controller('admin/thoughts')
export class AdminThoughtController {
  constructor(private readonly thoughtService: ThoughtService) {}

  @ApiOperation({ summary: '创建说说' })
  @Post()
  async createThought(@Body() createThoughtDto: CreateThoughtDto) {
    return await this.thoughtService.createThought(createThoughtDto);
  }

  @ApiOperation({ summary: '更新说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Put(':id')
  async updateThought(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateThoughtDto: UpdateThoughtDto,
  ) {
    return await this.thoughtService.updateThought(id, updateThoughtDto);
  }

  @ApiOperation({ summary: '删除说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Delete(':id')
  async deleteThought(@Param('id', ParseIntPipe) id: number) {
    return await this.thoughtService.deleteThought(id);
  }

  @ApiOperation({ summary: '分页获取所有说说' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  async getAllThoughts(
    @Query('page', ParseIntPipe) page,
    @Query('limit', ParseIntPipe) limit,
    @Query('status') status?: ContentStatus,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return await this.thoughtService.getPaginatedThoughts(
      page,
      limit,
      status,
      sortOrder,
      search,
    );
  }

  @ApiOperation({ summary: '根据ID获取说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Get(':id')
  async getThoughtById(@Param('id', ParseIntPipe) id: number) {
    return this.thoughtService.getThoughtById(id);
  }
}

@ApiTags('说说查看')
@IsPublic()
@Controller('/thoughts')
export class PublicThoughtController {
  constructor(private readonly thoughtService: ThoughtService) {}

  @ApiOperation({ summary: '分页获取所有已发布说说' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @Get()
  async getPublishedThoughts(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.thoughtService.getPaginatedThoughts(
      page,
      limit,
      ContentStatus.PUBLISHED,
    );
  }

  @ApiOperation({ summary: '根据ID获取已发布说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Get(':id')
  async getPublishedThoughtById(@Param('id', ParseIntPipe) id: number) {
    return this.thoughtService.getPublishedThoughtById(id);
  }
}
