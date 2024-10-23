import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称', example: '技术' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须为字符串' })
  name: string;

  @ApiProperty({
    description: '分类的 slug (URL 友好的唯一标识)',
    example: 'technology',
  })
  @IsNotEmpty({ message: '分类 slug 不能为空' })
  @IsString({ message: '分类 slug 必须为字符串' })
  slug: string;
}
