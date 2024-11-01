import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { ContentStatus } from '../../../enums/content-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({ description: '随笔标题', required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '随笔内容', required: false })
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: '随笔状态，发布或隐藏',
    required: false,
    enum: ContentStatus,
  })
  @IsEnum(ContentStatus, { message: '状态必须是 published 或 hidden' })
  @IsOptional()
  status?: ContentStatus;
}
