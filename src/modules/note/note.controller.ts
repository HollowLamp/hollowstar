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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { ContentStatus } from 'src/enums/content-status.enum';
import { RealIp } from 'src/common/decorators/real-ip.decorator';

@ApiTags('随笔管理')
@ApiBearerAuth()
@Controller('admin/notes')
export class AdminNoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: '创建随笔' })
  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.createNote(createNoteDto);
  }

  @ApiOperation({ summary: '更新随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Put(':id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.updateNote(id, updateNoteDto);
  }

  @ApiOperation({ summary: '删除随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Delete(':id')
  async deleteNote(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.deleteNote(id);
  }

  @ApiOperation({ summary: '分页获取所有随笔' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'sortField', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'search', required: false })
  @Get()
  async getAllNotes(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('status') status?: ContentStatus,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return this.noteService.getPaginatedNotes(
      page,
      limit,
      status,
      sortField,
      sortOrder,
      search,
    );
  }

  @ApiOperation({ summary: '根据ID获取随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Get(':id')
  async getNoteById(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.getNoteById(id);
  }
}

@ApiTags('随笔查看')
@IsPublic()
@Controller('/notes')
export class PublicNoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: '分页获取所有已发布随笔' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @Get()
  async getPublishedNotes(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.noteService.getPaginatedNotes(
      page,
      limit,
      ContentStatus.PUBLISHED,
    );
  }

  @ApiOperation({ summary: '根据ID获取已发布随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Get(':id')
  async getPublishedNoteById(
    @Param('id', ParseIntPipe) id: number,
    @RealIp() ip: string,
  ) {
    return this.noteService.getPublishedNoteById(id, ip);
  }
}
