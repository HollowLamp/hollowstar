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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { ContentStatus } from 'src/enums/content-status.enum';

@ApiTags('随笔管理')
@ApiBearerAuth()
@Controller('admin/notes')
export class AdminNoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: '创建随笔' })
  @Post()
  async createnote(@Body() createNoteDto: CreateNoteDto) {
    return await this.noteService.createNote(createNoteDto);
  }

  @ApiOperation({ summary: '更新随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Put(':id')
  async updatenote(
    @Param('id', ParseIntPipe) id,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return await this.noteService.updateNote(id, updateNoteDto);
  }

  @ApiOperation({ summary: '删除随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Delete(':id')
  async deletenote(@Param('id', ParseIntPipe) id) {
    return await this.noteService.deleteNote(id);
  }

  @ApiOperation({ summary: '获取所有随笔' })
  @Get()
  async getAllnotes() {
    return await this.noteService.getAllNotes();
  }

  @ApiOperation({ summary: '获取所有隐藏随笔' })
  @Get('hidden')
  async getHiddennotes() {
    return this.noteService.getNotesByStatus(ContentStatus.HIDDEN);
  }

  @ApiOperation({ summary: '根据ID获取随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Get(':id')
  async getnoteById(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.getNoteById(id);
  }
}

@ApiTags('随笔查看')
@IsPublic()
@Controller('/notes')
export class PublicNoteController {
  constructor(private readonly noteService: NoteService) {}

  @ApiOperation({ summary: '获取所有已发布随笔' })
  @Get()
  async getPublishednotes() {
    return this.noteService.getNotesByStatus(ContentStatus.PUBLISHED);
  }

  @ApiOperation({ summary: '根据ID获取已发布随笔' })
  @ApiParam({ name: 'id', description: '随笔 ID' })
  @Get(':id')
  async getPublishednoteById(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.getPublishedNoteById(id);
  }
}
