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
  async createthought(@Body() createThoughtDto: CreateThoughtDto) {
    return await this.thoughtService.createThought(createThoughtDto);
  }

  @ApiOperation({ summary: '更新说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Put(':id')
  async updateThought(
    @Param('id', ParseIntPipe) id,
    @Body() updateThoughtDto: UpdateThoughtDto,
  ) {
    return await this.thoughtService.updateThought(id, updateThoughtDto);
  }

  @ApiOperation({ summary: '删除说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Delete(':id')
  async deletethought(@Param('id', ParseIntPipe) id) {
    return await this.thoughtService.deleteThought(id);
  }

  @ApiOperation({ summary: '获取所有说说' })
  @Get()
  async getAllThoughts() {
    return await this.thoughtService.getAllThoughts();
  }

  @ApiOperation({ summary: '获取所有隐藏说说' })
  @Get('hidden')
  async getHiddenThoughts() {
    return this.thoughtService.getThoughtsByStatus(ContentStatus.HIDDEN);
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

  @ApiOperation({ summary: '获取所有已发布说说' })
  @Get()
  async getPublishedThoughts() {
    return this.thoughtService.getThoughtsByStatus(ContentStatus.PUBLISHED);
  }

  @ApiOperation({ summary: '根据ID获取已发布说说' })
  @ApiParam({ name: 'id', description: '说说 ID' })
  @Get(':id')
  async getPublishedThoughtById(@Param('id', ParseIntPipe) id: number) {
    return this.thoughtService.getPublishedThoughtById(id);
  }
}
