import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { ContentStatus } from '../../../enums/content-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({ description: '文章标题', required: false })
  title?: string;

  @ApiProperty({ description: '文章内容', required: false })
  content?: string;

  @ApiProperty({
    description: '文章状态，发布或隐藏',
    required: false,
    enum: ContentStatus,
  })
  @IsEnum(ContentStatus, { message: '状态必须是 published 或 hidden' })
  status?: ContentStatus;

  @ApiProperty({ description: '分类ID', required: false })
  categoryId?: number;

  @ApiProperty({ description: '文章slug', required: false })
  slug?: string;
}