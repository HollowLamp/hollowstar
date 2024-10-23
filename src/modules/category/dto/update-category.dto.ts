import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须为字符串' })
  name: string;

  @ApiProperty({ description: '分类的 slug' })
  @IsNotEmpty({ message: '分类 slug 不能为空' })
  @IsString({ message: '分类 slug 必须为字符串' })
  slug: string;
}
