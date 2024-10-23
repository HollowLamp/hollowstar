import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateThoughtDto } from './create-thought.dto';
import { ContentStatus } from '../../../enums/content-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateThoughtDto extends PartialType(CreateThoughtDto) {
  @ApiProperty({ description: '说说内容', required: false })
  content?: string;

  @ApiProperty({
    description: '说说状态，发布或隐藏',
    required: false,
    enum: ContentStatus,
  })
  @IsEnum(ContentStatus, { message: '状态必须是 published 或 hidden' })
  status?: ContentStatus;
}
