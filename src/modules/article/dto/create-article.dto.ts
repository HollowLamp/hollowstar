import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsEnum } from 'class-validator';
import { ContentStatus } from '../../../enums/content-status.enum';

export class CreateArticleDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  title: string;

  @ApiProperty({ description: '文章内容' })
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @ApiProperty({ description: '文章状态，发布或隐藏' })
  @IsNotEmpty({ message: '状态不能为空' })
  @IsEnum(ContentStatus, { message: '状态必须是 published 或 hidden' })
  status: ContentStatus;

  @ApiProperty({ description: '分类ID' })
  @IsInt()
  @IsNotEmpty({ message: '分类不能为空' })
  categoryId: number;

  @ApiProperty({ description: '文章slug' })
  @IsNotEmpty({ message: 'slug不能为空' })
  @IsString()
  slug: string;
}
