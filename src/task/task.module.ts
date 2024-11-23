import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { SyncService } from './sync.service';

@Module({
  providers: [TaskService, SyncService],
})
export class TaskModule {}
