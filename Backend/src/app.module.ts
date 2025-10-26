import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TextModule } from './text/text.module';
import { ConfigModule } from '@nestjs/config';
import { LetterModule } from './letter/letter.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TextModule, LetterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
