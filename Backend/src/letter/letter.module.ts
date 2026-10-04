import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
