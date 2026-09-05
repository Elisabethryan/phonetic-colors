import { Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { TextService } from './text.service';
import { DbTestService } from 'src/db/db-test-service';

@Module({
  imports: [],
  controllers: [TextController],
  providers: [TextService, DbTestService],
})
export class TextModule {}
