import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ContentStatus } from '../../../enums/content-status.enum';

export class CreateNoteDto {
  @ApiProperty({ description: '随笔标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  title: string;

  @ApiProperty({ description: '随笔内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '随笔状态，发布或隐藏' })
  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(ContentStatus, { message: '状态必须是 published 或 hidden' })
  status: ContentStatus;
}
