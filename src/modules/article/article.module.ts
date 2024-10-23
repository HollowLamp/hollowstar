import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import {
  AdminArticleController,
  PublicArticleController,
} from './article.controller';

@Module({
  controllers: [AdminArticleController, PublicArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
