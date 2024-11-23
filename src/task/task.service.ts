import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncService } from './sync.service';
import { Logger } from 'src/logger/logger';

@Injectable()
export class TaskService {
  constructor(private readonly syncService: SyncService) {}

  @Inject(Logger)
  private logger: Logger;

  @Cron('0 4 * * *')
  async handleNoteViewsSync() {
    this.logger.log('views syncToDB start', 'Task Service');
    await this.syncService.syncViewsToDatabase();
    this.logger.log('views syncToDB done', 'Task Service');
  }
}
