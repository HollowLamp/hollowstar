import { Module } from '@nestjs/common';
import { ThoughtService } from './thought.service';
import {
  AdminThoughtController,
  PublicThoughtController,
} from './thought.controller';

@Module({
  controllers: [AdminThoughtController, PublicThoughtController],
  providers: [ThoughtService],
})
export class ThoughtModule {}
