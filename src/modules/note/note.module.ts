import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { AdminNoteController, PublicNoteController } from './note.controller';

@Module({
  controllers: [AdminNoteController, PublicNoteController],
  providers: [NoteService],
})
export class NoteModule {}
