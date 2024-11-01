import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsOptional()
  @IsString({ message: '分类名称必须为字符串' })
  name?: string;

  @ApiProperty({ description: '分类的 slug' })
  @IsOptional()
  @IsString({ message: '分类 slug 必须为字符串' })
  slug?: string;
}
