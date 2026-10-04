import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TextService } from './text.service';
import { CreateTextDto } from './dto/create-text.dto';
import { Text } from 'src/types/general/text';
import { DbTestService } from '../db/db-test-service';

@Controller()
export class TextController {
  constructor(
    private readonly textService: TextService,
    private readonly dbTestService: DbTestService,
  ) {}

  @Post('text')
  createText(@Body() createTextDto: CreateTextDto) {
    return this.textService.createText(
      createTextDto.title,
      createTextDto.transcription,
    );
  }

  @Get('text/:id')
  async getListItem(@Param('id') id: string): Promise<Text | undefined> {
    const extendedItem = await this.textService.getText(id);
    return extendedItem;
  }

  @Get('testdb')
  async testDb() {
    return this.dbTestService.checkConnection();
  }
}
