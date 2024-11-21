import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUrl,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '评论内容' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString({ message: '评论内容必须为字符串' })
  content: string;

  @ApiProperty({ description: '文章的 slug', required: false })
  @IsOptional()
  @IsString({ message: '文章的 slug 必须为字符串' })
  articleSlug?: string;

  @ApiProperty({ description: '随笔的 ID', required: false })
  @IsOptional()
  noteId?: number;

  @ApiProperty({ description: '说说的 ID', required: false })
  @IsOptional()
  thoughtId?: number;

  @ApiProperty({ description: '用户昵称', required: false })
  @IsOptional()
  @IsString({ message: '昵称必须为字符串' })
  nickname?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '用户头像 URL', required: false })
  @IsOptional()
  @IsString({ message: '头像 URL 必须为字符串' })
  avatarUrl?: string;

  @ApiProperty({ description: '用户网址', required: false })
  @IsOptional()
  @IsUrl({}, { message: '网址格式不正确' })
  website?: string;

  @ApiProperty({ description: '客户端 IP', required: false })
  @IsOptional()
  @IsString({ message: '客户端 IP 必须为字符串' })
  clientIp?: string;

  @ApiProperty({ description: '用户代理字符串', required: false })
  @IsOptional()
  @IsString({ message: '用户代理字符串必须为字符串' })
  userAgent?: string;
}
