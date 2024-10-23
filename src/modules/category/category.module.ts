import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  AdminCategoryController,
  PublicCategoryController,
} from './category.controller';

@Module({
  controllers: [AdminCategoryController, PublicCategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
