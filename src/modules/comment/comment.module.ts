import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  PublicCommentController,
  AdminCommentController,
} from './comment.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [PublicCommentController, AdminCommentController],
  providers: [CommentService],
})
export class CommentModule {}
