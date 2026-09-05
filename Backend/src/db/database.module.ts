import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DbTestService } from './db-test-service';

@Module({
  providers: [DatabaseService, DbTestService],
  exports: [DatabaseService, DbTestService],
})
export class DatabaseModule {}
